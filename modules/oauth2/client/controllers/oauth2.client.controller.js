'use strict';

angular.module('oauth2').controller('OAuth2Controller', OAuth2);

OAuth2.$inject = ['$http', '$window'];

function OAuth2($http, $window) {
  var oauth2 = this;

  // TODO: Retrieve these attributes from the parameters of the query
  oauth2.clientID = 'toto';
  oauth2.redirectURI = 'http://localhost:9000';
  oauth2.responseType = 'code';
  oauth2.transactionID = '';

  oauth2.authorize = function () {
    var url = '/oauth2/authorization?client_id=' + oauth2.clientID + '&redirect_uri=' + oauth2.redirectURI + '&response_type=' + oauth2.responseType;
    $http.get(url, {
      clientID: oauth2.clientID,
      redirectURI: oauth2.redirectURI
    }).success(function (data, status) {
      // TODO: redirect if already code
      oauth2.transactionID = data.transactionID;
    }).error(function (data, status) {
      // TODO: redirect if error
    });
  };

  oauth2.authorize();
}
