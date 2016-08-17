'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * AuthorizationCode Schema
 */
var AuthorizationCodeSchema = new Schema({
  code: {
    type: String,
    trim: true
  },
  clientID: {
    type: String,
    trim: true
  },
  redirectURI: {
    type: String,
    trim: true
  },
  userID: {
    type: String,
    trim: true
  }
});

mongoose.model('AuthorizationCode', AuthorizationCodeSchema);
