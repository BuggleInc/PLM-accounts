'use strict';

// Setting up route
angular.module('oauth2').config(['$stateProvider',
 function ($stateProvider) {
    // Users state routing
    $stateProvider.
    state('authorize', {
      url: '/dialog/authorize',
      templateUrl: 'modules/oauth2/views/authorization.view.html',
      controller: 'OAuth2',
      controllerAs: 'oauth2'
    });
 }
]);