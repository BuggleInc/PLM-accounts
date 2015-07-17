'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  _ = require('lodash'),
  Client = mongoose.model('Client');

exports.clientByPrivateID = function (id, next) {
  Client.findOne({
    _id: id
  }).exec(function (err, client) {
    next(err, client);
  });
};

exports.clientByID = function (clientID, next) {
  Client.findOne({
    clientID: clientID
  }).exec(function (err, client) {
    next(err, client);
  });
};