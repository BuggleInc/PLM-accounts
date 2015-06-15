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

exports.findByIds = function (clientID, userID, done) {
  AccessToken.findOne({
    clientID: clientID,
    userID: userID
  }).exec(function (err, token) {
    if (err) {
      return done(err);
    }
    if (!token) {
      return done(new Error('Failed to load AccessToken '));
    }
    done(null, token);
  });
};

exports.save = function (token, userID, clientID, done) {
  var newToken = {};
  AccessToken.findOne({
    userID: userID,
    clientID: clientID
  }).exec(function (err, existingToken) {
    if (err) {
      return done(err);
    }
    if (!existingToken) {
      newToken = new AccessToken({
        key: token,
        clientID: clientID,
        userID: userID
      });
    } else {
      newToken = existingToken;
      newToken.key = token;
    }
    newToken.save(function (err2) {
      if (err2) {
        done(err2);
      } else {
        done(null);
      }
    });
  });
};