'use strict';

/**
 * Module dependencies.
 */
var oauth2 = require('../controllers/oauth2.server.controller');

module.exports = function (app) {

  // Routes to
  app.route('/oauth2/authorization')
    .get(oauth2.authorization);

  app.route('/oauth2/decision')
    .post(oauth2.decision);

  // Route to
  app.route('/api/oauth2/token')
    .post(oauth2.token);

  // Route to
  app.route('/api/oauth2/users')
    .get(oauth2.getUser);
};
