'use strict';

angular.module('subexpuestaV2App')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window, Email) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        var usernameLimpio = ($scope.user.username.toString()).replace(/[&\/\\#,+()$~%.='!":*?<>{}]/g,'-');
        console.log('usernameLimpio: '+usernameLimpio);
        Auth.createUser({
          name: $scope.user.name,
          username: usernameLimpio,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          Email.EmailEnviar.enviarMail({
                direccion: $scope.user.email
            },function(mensaje) {

            });

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

    

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
