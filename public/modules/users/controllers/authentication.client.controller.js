'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$state',
 function ($scope, $http, $location, Authentication, $state) {
    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) $location.path('/');

    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the index page
        if (localStorage.clientID && localStorage.redirectURI && localStorage.responseType) {
          var clientID = localStorage.clientID;
          var redirectURI = localStorage.redirectURI;
          var responseType = localStorage.responseType;
          delete localStorage.clientID;
          delete localStorage.redirectURI;
          delete localStorage.responseType;
          $state.go('authorize', {
            response_type: responseType,
            client_id: clientID,
            redirect_uri: redirectURI
          });
        } else {
          $location.path('/');
        }
      }).error(function (response) {
        $scope.error = response;
      });
    };

    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response.user;

        // And redirect to the index page
        if (localStorage.clientID && localStorage.redirectURI && localStorage.responseType) {
          var clientID = localStorage.clientID;
          var redirectURI = localStorage.redirectURI;
          var responseType = localStorage.responseType;
          delete localStorage.clientID;
          delete localStorage.redirectURI;
          delete localStorage.responseType;
          $state.go('authorize', {
            response_type: responseType,
            client_id: clientID,
            redirect_uri: redirectURI
          });
        } else {
          $location.path(response.path);
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
 }
]);