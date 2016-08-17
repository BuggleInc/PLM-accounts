'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  oauth2orize = require('oauth2orize'),
  uuid = require('uuid'),
  AccessToken = mongoose.model('AccessToken'),
  AuthorizationCode = mongoose.model('AuthorizationCode'),
  Client = mongoose.model('Client'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

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
  return done(null, client.clientID);
});

server.deserializeClient(function (id, done) {
  var searchQuery = {
    'clientID': id
  };

  Client.findOne(searchQuery, function (err, client) {
    if (err || !client) {
      return done(err);
    } else {
      return done(null, client);
    }
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
  var code = uuid.v4();

  var authCode = new AuthorizationCode({
    'code': code,
    'clientID': client.clientID,
    'redirectURI': redirectURI,
    'userID': user.id
  });

  authCode.save(function (err) {
    if (err) {
      done(err);
    } else {
      done(null, code);
    }
  });
}));

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectURI` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(oauth2orize.exchange.code(function (client, code, redirectURI, done) {
  var searchQuery = {
    'code': code
  };
  AuthorizationCode.findOne(searchQuery, function (err, authCode) {
    if (err) {
      return done(err);
    }
    if (authCode === undefined ||
      client.clientID !== authCode.clientID ||
      redirectURI !== client.redirectURI) {
      return done(null, false);
    }

    authCode.remove(function (err) {
      if (err) {
        return done(err);
      }

      var token = uuid.v4();

      var accessToken = new AccessToken({
        'token': token,
        'userID': authCode.userID,
        'clientID': authCode.clientID
      });

      accessToken.save(function (err) {
        if (err) {
          done(err);
        } else {
          done(null, token);
        }
      });
    });
  });
}));

exports.authorization = [
  function (req, res, next) {
    if(!req.user) {
      res.sendStatus(500);
    } else {
      next();
    }
  },
  server.authorization(function(clientID, redirectURI, done) {
    var searchQuery = {
      'clientID': clientID,
      'redirectURI': redirectURI
    };

    Client.findOne(searchQuery, function(err, client) {
      if(err || !client) {
        done(err);
      } else {
        done(null, client, redirectURI);
      }
    });
  }),
  function (req, res) {
    res.json({
      transactionID: req.oauth2.transactionID
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
  function (req, res, next) {
    if(!req.user) {
      res.sendStatus(500);
    } else {
      next();
    }
  },
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

exports.getUser = [
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    // We want to update the avatar URL for other domains
    req.user.profileImageURL = req.headers.host + req.user.profileImageURL;
    res.json(req.user);
  }
];
