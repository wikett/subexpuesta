'use strict';

angular.module('subexpuestaV2App')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          username: $scope.user.username,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            console.log('error: '+error.message+' field: '+field);
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.crearAdmin = function(){
      Auth.createUser({
          name: 'Enrique',
          username: 'SuperAdmin',
          email: 'enrique.ac9@gmail.com',
          password: 'poiuasdf77',
          provider: 'local',
          role: 'admin'
        })
        .then( function() {
          // Account created, redirect to home
          console.log('Admin creado correctamente');
        })
        .catch( function(err) {
          err = err.data;
          console.log('ERROR: '+JSON.stringify(err));
          $scope.errors = {};
        });
      
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
