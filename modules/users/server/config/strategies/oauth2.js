'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  passport = require('passport'),
  BasicStrategy = require('passport-http').BasicStrategy,
  ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
  BearerStrategy = require('passport-http-bearer').Strategy,
  AccessToken = mongoose.model('AccessToken'),
  Client = mongoose.model('Client'),
  User = mongoose.model('User');


module.exports = function (config) {

  /**
   * BasicStrategy & ClientPasswordStrategy
   *
   * These strategies are used to authenticate registered OAuth clients.  They are
   * employed to protect the `token` endpoint, which consumers use to obtain
   * access tokens.  The OAuth 2.0 specification suggests that clients use the
   * HTTP Basic scheme to authenticate.  Use of the client password strategy
   * allows clients to send the same credentials in the request body (as opposed
   * to the `Authorization` header).  While this approach is not recommended by
   * the specification, in practice it is quite common.
   */
  passport.use(new BasicStrategy(
    function(username, password, done) {
      var searchQuery = {
        clientID: username,
        clientSecret: password
      };
      Client.findOne(searchQuery, function(err, client) {
        if (err) { return done(err); }
        if (!client) { return done(null, false); }
        return done(null, client);
      });
    }
  ));

  passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
      var searchQuery = {
        clientID: clientId,
        clientSecret: clientSecret
      };
      Client.findOne(searchQuery, function(err, client) {
        if (err) { return done(err); }
        if (!client) { return done(null, false); }
        return done(null, client);
      });
    }
  ));

  /**
   * BearerStrategy
   *
   * This strategy is used to authenticate users based on an access token (aka a
   * bearer token).  The user must have previously authorized a client
   * application, which is issued an access token to make requests on behalf of
   * the authorizing user.
   */
  passport.use(new BearerStrategy(
    function(accessToken, done) {
      var searchQuery = {
        token: accessToken
      };
      AccessToken.findOne(searchQuery, function(err, token) {
        if (err) { return done(err); }
        if (!token) { return done(null, false); }

        User.findById(token.userID, function(err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          // to keep this example simple, restricted scopes are not implemented,
          // and this is just for illustrative purposes
          var info = { scope: '*' };
          done(null, user, info);
        });
      });
    }
  ));

};
