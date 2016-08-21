'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  uuid = require('uuid'),
  Client = mongoose.model('Client'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a client
 */
exports.create = function (req, res) {
  var client = new Client(req.body);
  client.user = req.user;

  client.clientID = uuid.v4();
  client.clientSecret = uuid.v4();

  client.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(client);
    }
  });
};

/**
 * Show the current client
 */
exports.read = function (req, res) {
  res.json(req.client);
};

/**
 * Update a client
 */
exports.update = function (req, res) {
  var client = req.client;

  client.clientName = req.body.clientName;
  client.redirectURI = req.body.redirectURI;

  client.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(client);
    }
  });
};

/**
 * Delete an client
 */
exports.delete = function (req, res) {
  var client = req.client;

  client.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(client);
    }
  });
};

/**
 * List of Clients
 */
exports.list = function (req, res) {
  console.log('req.user: ', req.user);
  Client.find({ user: req.user._id }).sort('-created').populate('user', 'displayName').exec(function (err, clients) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(clients);
    }
  });
};

/**
 * Client middleware
 */
exports.clientByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Client is invalid'
    });
  }

  Client.findById(id).populate('user', 'displayName').exec(function (err, client) {
    if (err) {
      return next(err);
    } else if (!client) {
      return res.status(404).send({
        message: 'No client with that identifier has been found'
      });
    }
    req.client = client;
    next();
  });
};
