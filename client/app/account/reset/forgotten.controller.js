'use strict';

angular.module('subexpuestaV2App')
    .controller('ForgottenCtrl', function($scope, $log, $http) {

            $scope.error = false;
            $scope.enviando = false;
            $scope.enviado = false;
            $scope.correo = '';

            $scope.caca = '';


            $scope.olivdePassword = function() {
                $scope.submitted = true;
                
                if (!_.isUndefined($scope.correo)) {
                    
                    $scope.enviando = true;
                    //$log.debug('email: ' + $scope.correo);

                      $http({
                          url: 'http://www.subexpuesta.com/api/users/forgotten',
                          method: "POST",
                          data: { 'email' : $scope.correo },
                          headers: 'application/json'
                      })
                      .then(function(response) {
                              // success
                              //$log.debug('Exito: '+JSON.stringify(response));
                              $scope.enviado = true;
                              $scope.enviando = false;
                      }, 
                      function(response) { // optional
                              // failed
                              //$log.debug('Error: '+JSON.stringify(response));
                              $scope.error = true;
                      });


                }
              };

              $scope.volver = function(){
                $scope.enviando = false;
                $scope.error = false;               
                $scope.enviado = false;
                $scope.correo = '';
              };

            });