'use strict';

angular.module('subexpuestaV2App')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window, Email, $log) {
    $scope.user = {};
    $scope.errors = {};


    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        var usernameLimpio = ($scope.user.username.toString()).replace(/[&\/\\#,+()$~%.='!":*?<>{}]/g,'-');
        var origenUsuario = $scope.user.origen;
        //$log.debug('$scope.codigoOtros: '+$scope.user.origen);
        //$log.debug('$scope.user.origenTexto: '+$scope.user.origenTexto);

        if(!_.isUndefined($scope.user.origenTexto))
        {
          origenUsuario = $scope.user.origenTexto;
        }

        //$log.debug('origen: '+origenUsuario);
        Auth.createUser({
          name: $scope.user.name,
          username: usernameLimpio,
          email: $scope.user.email,
          origen: origenUsuario,
          password: $scope.user.password
        })
        .then( function() {
          Email.EmailEnviar.enviarMail({
                direccion: $scope.user.email
            },function(mensaje) {

            });

          $location.path('/');

        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};
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
