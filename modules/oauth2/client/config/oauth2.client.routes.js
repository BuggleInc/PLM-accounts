'use strict';

// Setting up route
angular.module('oauth2').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('oauth2', {
        abstract: true,
        url: '/oauth2',
        template: '<ui-view/>'
      })
      .state('oauth2.dialog', {
        url: '/dialog?response_type&client_id&redirect_uri',
        templateUrl: 'modules/oauth2/client/views/dialog.client.view.html',
        data: {
          roles: ['user', 'admin']
        },
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
        },
        controller: 'OAuth2Controller as oauth2'
      });
  }
]);
