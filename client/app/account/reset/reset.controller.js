'use strict';

angular.module('subexpuestaV2App')
    .controller('ResetCtrl', function($scope, $log, $http, $stateParams) {

        $scope.error = false;
        $scope.errorPassword = false;
        $scope.enviado = false;
        $scope.password = '';
        $scope.passwordAgain = '';

        $scope.resetear = function() {

            $log.debug('Token: ' + $stateParams.token);

            if ($scope.password !== $scope.passwordAgain) {
                $scope.errorPassword = true;
            } else {
                $scope.errorPassword = false;

                $http({
                    url: 'http://localhost:9000/api/users/reset/' + $stateParams.token,
                    method: "POST",
                    data: {
                        'password': $scope.password
                    },
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

        $scope.volver = function() {
            $scope.enviando = false;
            $scope.error = false;
            $scope.enviado = false;
            $scope.correo = '';
        };



    });