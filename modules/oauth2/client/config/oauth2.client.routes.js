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
        url: '/dialog',
        templateUrl: 'modules/oauth2/client/views/dialog.client.view.html',
        data: {
          roles: ['user', 'admin']
        },
        controller: 'OAuth2Controller as oauth2'
      });
  }
]);
