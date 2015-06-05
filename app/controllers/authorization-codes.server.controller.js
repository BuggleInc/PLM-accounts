'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  _ = require('lodash'),
  AuthorizationCode = mongoose.model('AuthorizationCode');

exports.find = function (key, done) {
  AuthorizationCode.findOne({
    key: key
  }).exec(function (err, code) {
    if (err) {
      return done(err);
    }
    if (!code) {
      return done(new Error('Failed to load AuthorizationCode ' + key));
    }
    done(null, code);
  });
};

exports.save = function (code, clientID, redirectURI, userID, done) {
  // Init Variables
  var authorizationCode = new AuthorizationCode({
    key: code,
    clientID: clientID,
    redirectURI: redirectURI,
    userID: userID
  });

  // Then save the user 
  authorizationCode.save(function (err) {
    if (err) {
      done(err);
    } else {
      done(null);
    }
  });
};

exports.delete = function (key, done) {
  AuthorizationCode.remove({
    key: key
  }).exec(function (err) {
    if (err) {
      return done(err);
    }
    done(null);
  });
};