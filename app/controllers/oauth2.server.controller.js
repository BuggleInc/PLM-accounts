'use strict';

/**
 * Module dependencies.
 */
var authorizationCodes = require('./authorization-codes.server.controller'),
  accessTokens = require('./access-tokens.server.controller'),
  clients = require('./clients.server.controller'),
  users = require('./users.server.controller'),
  _ = require('lodash'),
  oauth2orize = require('oauth2orize'),
  passport = require('passport'),
  BasicStrategy = require('passport-http').BasicStrategy,
  ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
  BearerStrategy = require('passport-http-bearer').Strategy,
  login = require('connect-ensure-login'),
  utils = require('../utils/uuid.server.utils');

exports.getUser = function (req, res) {
  var tokenID = req.params.token;
  accessTokens.find(tokenID, function (err, token) {
    users.userByID(token.userID, function (err, user) {
      res.json(user);
    });
  });
};

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(function (client, done) {
  return done(null, client.id);
});

server.deserializeClient(function (id, done) {
  clients.clientByID(id, function (err, client) {
    if (err) {
      return done(err);
    }
    return done(null, client);
  });
});

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes.  The callback takes the `client` requesting
// authorization, the `redirectURI` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code(function (client, redirectURI, user, ares, done) {
  var code = utils.uid(16);

  authorizationCodes.save(code, client.id, redirectURI, user.id, function (err) {
    if (err) {
      return done(err);
    }
    return done(null, code);
  });
}));

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectURI` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(oauth2orize.exchange.code(function (client, code, redirectURI, done) {
  authorizationCodes.find(code, function (err, authCode) {
    if (err) {
      return done(err);
    }
    if (authCode === undefined) {
      return done(null, false);
    }

    if (client._id.toString() !== authCode.clientID) {
      return done(null, false);
    }

    if (redirectURI !== client.redirectURI) {
      return done(null, false);
    }

    authorizationCodes.delete(code, function (err) {
      if (err) {
        return done(err);
      }
      var token = utils.uid(256);
      accessTokens.save(token, authCode.userID, authCode.clientID, function (err) {
        if (err) {
          return done(err);
        }
        return done(null, token);
      });
    });
  });
}));

passport.use(new BasicStrategy(
  function (username, password, done) {
    clients.clientByID(username, function (err, client) {
      if (err) {
        return done(err);
      }
      if (!client) {
        return done(null, false);
      }
      if (client.clientSecret !== password) {
        return done(null, false);
      }
      return done(null, client);
    });
  }
));

passport.use(new ClientPasswordStrategy(
  function (clientID, clientSecret, done) {
    clients.clientByID(clientID, function (err, client) {
      if (err) {
        return done(err);
      }
      if (!client) {
        return done(null, false);
      }
      if (client.clientSecret !== clientSecret) {
        return done(null, false);
      }
      return done(null, client);
    });
  }
));

exports.authorization = [
  login.ensureLoggedIn('/#!/signin'),
  function (req, res, next) {
    var clientID = req.query.client_id;
    var redirectURI = req.query.redirectURI;
    var userID = req.user.id;
    accessTokens.findByIds(clientID, userID, function (err, token) {
      if (err || !token) {
        next();
      } else {
        var code = utils.uid(16);
        authorizationCodes.save(code, clientID, redirectURI, userID, function (err) {
          if (err) {
            next();
          }
          res.json({
            code: code
          });
        });
      }
    });
  },
  server.authorization(function (clientID, redirectURI, done) {
    clients.clientByID(clientID, function (err, client) {
      if (err) {
        return done(err);
      }
      if (!client || (redirectURI !== client.redirectURI)) {
        return done(null, false);
      }

      return done(null, client, redirectURI);
    });
  }),
  function (req, res) {
    res.json({
      transactionID: req.oauth2.transactionID,
      user: req.user,
      client: req.oauth2.client
    });
  }
];

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

exports.decision = [
  login.ensureLoggedIn('/#!/signin'),
  server.decision()
];


// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], {
    session: false
  }),
  server.token(),
  server.errorHandler()
];