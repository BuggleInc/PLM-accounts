'use strict';

/**
 * Module dependencies.
 */
var clients = require('../controllers/clients.server.controller');

module.exports = function (app) {
  // Clients collection routes
  app.route('/api/clients')
    .get(clients.list)
    .post(clients.create);

  // Single client routes
  app.route('/api/clients/:id')
    .get(clients.read)
    .put(clients.update)
    .delete(clients.delete);

  // Single client route to regenerate its secret
  app.route('/api/clients/:id/regenerateSecret')
    .put(clients.regenerateSecret);

  // Check if user is authenticated
  app.use('/api/clients', clients.ensureLoggedIn);

  // Finish by binding the client middleware
  app.param('id', clients.clientByID);
};
