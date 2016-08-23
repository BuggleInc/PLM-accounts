'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * AuthorizedApplication Schema
 */
var AuthorizedApplicationSchema = new Schema({
  client: {
    type: Schema.ObjectId,
    ref: 'Client'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('AuthorizedApplication', AuthorizedApplicationSchema);
