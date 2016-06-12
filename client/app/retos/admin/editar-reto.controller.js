'use strict';

angular.module('subexpuestaV2App')
    .controller('EditarRetoCtrl', function($scope, $rootScope,$stateParams, $log, Reto, Auth, $location) {

        if (!Auth.isAdmin()) {
            $location.path('/');
        }

        $scope.finalizado = false;

        $scope.mensajeError = "";


        $scope.retoModificado = false;

        function getEvento() {

            Reto.get({
                id: $stateParams.id
            }, function(eventoData) {
                $scope.reto = eventoData;
            });


        };

        getEvento();

        $scope.modificarReto = function() {
            $scope.reto.$update().then(function(response) {
                $scope.retoModificado = true;
                $scope.mensajeError = "";
            })
        };


    });