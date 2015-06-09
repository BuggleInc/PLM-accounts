'use strict';

module.exports = function (app) {

  // OAuth Routes
  var oauth2 = require('../../app/controllers/oauth2.server.controller');

  app.route('/dialog/authorize').get(oauth2.authorization);
  app.route('/dialog/authorize/decision').post(oauth2.decision);
  app.route('/oauth/token').post(oauth2.token);
  
  app.route('/oauth/users/:token').get(oauth2.getUser);
};