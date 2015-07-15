'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Client Schema
 */
var ClientSchema = new Schema({
  clientId: {
    type: String,
    trim: true
  },
  clientName: {
    type: String,
    trim: true
  },
  clientSecret: {
    type: String,
    trim: true
  },
  redirectURI: {
    type: String,
    trim: true
  }
});

mongoose.model('Client', ClientSchema);