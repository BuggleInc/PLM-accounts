'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  _ = require('lodash'),
  AccessToken = mongoose.model('AccessToken');

exports.find = function (key, done) {
  AccessToken.findOne({
    key: key
  }).exec(function (err, token) {
    if (err) {
      return done(err);
    }
    if (!token) {
      return done(new Error('Failed to load AccessToken ' + key));
    }
    done(null, token);
  });
};

exports.save = function (token, userID, clientID, done) {
  // Init Variables
  var accessToken = new AccessToken({
    key: token,
    clientID: clientID,
    userID: userID
  });

  // Then save the user 
  accessToken.save(function (err) {
    if (err) {
      done(err);
    } else {
      done(null);
    }
  });
};