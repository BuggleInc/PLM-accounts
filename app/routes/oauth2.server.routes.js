'use strict';

module.exports = function (app) {

  // OAuth Routes
  var oauth2 = require('../../app/controllers/oauth2.server.controller');

  app.get('/dialog/authorize', oauth2.authorization);
  app.post('/dialog/authorize/decision', oauth2.decision);
  app.post('/oauth/token', oauth2.token);
};