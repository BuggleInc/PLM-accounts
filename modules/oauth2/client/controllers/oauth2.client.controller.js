'use strict';

angular.module('oauth2').controller('OAuth2Controller', OAuth2);

OAuth2.$inject = ['$http', '$window', '$location', '$stateParams', 'Authentication'];

function OAuth2($http, $window, $location, $stateParams, Authentication) {
  var oauth2 = this;

  oauth2.error = false;
  oauth2.clientName = '';
  oauth2.clientID = $stateParams.client_id;
  oauth2.redirectURI = $stateParams.redirect_uri;
  oauth2.responseType = $stateParams.response_type;
  oauth2.user = Authentication.user;
  oauth2.missingParameters = [];

  oauth2.validParameters = function () {
    if ($stateParams.client_id && $stateParams.redirect_uri && $stateParams.response_type) {
      return true;
    }
    return false;
  };

  oauth2.generateParametersError = function () {
    oauth2.missingParameters = [];
    oauth2.errorMsg = 'The parameters which should provided by the client application are missing. Please report the following issue to the administrators of the client app and close this pop-up.';
    if(!$stateParams.client_id) {
      oauth2.missingParameters.push('client_id');
    }
    if(!$stateParams.redirect_uri) {
      oauth2.missingParameters.push('redirect_uri');
    }
    if(!$stateParams.response_type) {
      oauth2.missingParameters.push('response_type');
    }
  };

  oauth2.authorize = function () {
    var url = '/oauth2/authorization?client_id=' + oauth2.clientID + '&redirect_uri=' + oauth2.redirectURI + '&response_type=' + oauth2.responseType;
    $http.get(url, {
      clientID: oauth2.clientID,
      redirectURI: oauth2.redirectURI
    }).success(function (data, status) {
      // TODO: redirect if already code
      oauth2.transactionID = data.transactionID;
      oauth2.clientName = data.clientName;
    }).error(function (data, status) {
      oauth2.error = true;
      oauth2.errorMsg = 'The provided parameters are incorrect. Please report the following issue to the administrators of the client app and close this pop-up.';
    });
  };

  oauth2.error = !oauth2.validParameters();

  if (!oauth2.error) {
    oauth2.authorize();
  } else {
    oauth2.generateParametersError();
  }
}
