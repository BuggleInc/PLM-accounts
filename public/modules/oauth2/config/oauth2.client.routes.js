'use strict';

// Setting up route
angular.module('oauth2').config(['$stateProvider',
 function ($stateProvider) {
    // Users state routing
    $stateProvider.
    state('authorize', {
      url: '/dialog/authorize?response_type&client_id&redirect_uri',
      templateUrl: 'modules/oauth2/views/authorization.view.html',
      controller: 'OAuth2',
      controllerAs: 'oauth2',
      params: {
        response_type: {
          value: '',
          squash: false
        },
        client_id: {
          value: '',
          squash: false
        },
        redirect_uri: {
          value: '',
          squash: false
        }
      }
    });
 }
]);