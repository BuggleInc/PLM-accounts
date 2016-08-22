'use strict';

// Clients controller
angular.module('clients').controller('ClientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Clients',
  function ($scope, $stateParams, $location, Authentication, Clients) {
    $scope.authentication = Authentication;

    // Create new Client
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'clientForm');

        return false;
      }

      // Create new Client object
      var client = new Clients({
        clientName: this.clientName,
        redirectURI: this.redirectURI
      });

      // Redirect after save
      client.$save(function (response) {
        $location.path('clients/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Client
    $scope.remove = function (client) {
      if (client) {
        client.$remove();

        for (var i in $scope.clients) {
          if ($scope.clients[i] === client) {
            $scope.clients.splice(i, 1);
          }
        }
      } else {
        $scope.client.$remove(function () {
          $location.path('clients');
        });
      }
    };

    // Update existing Client
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'clientForm');

        return false;
      }

      var client = $scope.client;

      client.$update(function () {
        $location.path('clients/' + client._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Clients
    $scope.find = function () {
      $scope.clients = Clients.query();
    };

    // Find existing Client
    $scope.findOne = function () {
      $scope.client = Clients.get({
        id: $stateParams.id
      });
      $scope.client.$promise.then(function(data) {
        // Do nothing
      }, function(error) {
        if(error.status === 404) {
          // No existing client for this ID
          $location.path('clients');
        }
      });
    };
  }
]);
