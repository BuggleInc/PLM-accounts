'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  _ = require('lodash'),
  Client = mongoose.model('Client');

exports.clientByID = function (id, next) {
  Client.findOne({
    _id: id
  }).exec(function (err, client) {
    next(err, client);
  });
};