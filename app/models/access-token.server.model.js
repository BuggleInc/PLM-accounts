'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * AccessToken Schema
 */
var AccessTokenSchema = new Schema({
  key: {
    type: String,
    trim: true
  },
  userID: {
    type: String,
    trim: true
  },
  clientID: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('AccessToken', AccessTokenSchema);