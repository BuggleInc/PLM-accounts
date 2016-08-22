'use strict';

// Setting up route
angular.module('clients').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('clients', {
        abstract: true,
        url: '/clients',
        template: '<ui-view/>'
      })
      .state('clients.list', {
        url: '',
        templateUrl: 'modules/clients/client/views/list-clients.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('clients.create', {
        url: '/create',
        templateUrl: 'modules/clients/client/views/create-client.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('clients.view', {
        url: '/:id',
        templateUrl: 'modules/clients/client/views/view-client.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('clients.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/clients/client/views/edit-client.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
