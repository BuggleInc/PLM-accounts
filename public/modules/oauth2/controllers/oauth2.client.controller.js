'use strict';

angular.module('oauth2').controller('OAuth2', OAuth2);

OAuth2.$inject = ['$scope', '$http', '$stateParams', '$location', 'Authentication'];

function OAuth2($scope, $http, $stateParams, $location, Authentication) {
  var oauth2 = this;

  oauth2.responseType = $stateParams.response_type;
  oauth2.clientID = $stateParams.client_id;
  oauth2.redirectURI = $stateParams.redirect_uri;

  oauth2.client = {};
  oauth2.transactionID = '';
  oauth2.user = {};

  init();

  function init() {
    var urlParams = [
      'response_type=' + oauth2.responseType,
      'client_id=' + oauth2.clientID,
      'redirectURI=' + oauth2.redirectURI
    ];

    if (!Authentication.user) {
      localStorage.responseType = oauth2.responseType;
      localStorage.clientID = oauth2.clientID;
      localStorage.redirectURI = oauth2.redirectURI;
      $location.path('/signin');
    } else {
      delete localStorage.responseType;
      delete localStorage.clientID;
      delete localStorage.redirectURI;
    }

    var url = '/dialog/authorize?' + urlParams.join('&');
    $http.get(url)
      .success(function (response) {
        if (response.code) {
          // User already agreed to authorize the client to access his account
          window.location.href = oauth2.redirectURI + '?code=' + response.code;
        }
        oauth2.client = response.client;
        oauth2.transactionID = response.transactionID;
        oauth2.user = response.user;
      })
      .error(function (response) {
        console.log('error: ', response);
      });
  }
}