'use strict';

//Clients service used for communicating with the clients REST endpoints
angular.module('clients').factory('Clients', ['$resource',
  function ($resource) {
    return $resource('api/clients/:clientId', {
      clientId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
