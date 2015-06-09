'use strict';

angular.module('oauth2').controller('OAuth2', OAuth2);

OAuth2.$inject = ['$scope', '$http'];

function OAuth2($scope, $http) {
  var oauth2 = this;
  
  oauth2.client ={};
  oauth2.transactionID = '';
  oauth2.user = {};
  
  init();
  
  function init() {
    var urlParams = [
      'response_type=code',
      'client_id=5571b379afb1a0859de08ca3',
      'redirectURI=http://localhost:9000'
    ];
    var url = '/dialog/authorize?' + urlParams.join('&');
    $http.get(url)
    .success(function (response) {
      oauth2.client = response.client;
      oauth2.transactionID = response.transactionID;
      oauth2.user = response.user;
    })
    .error(function (response) {
      console.log('error: ', response);
    });
  }
}