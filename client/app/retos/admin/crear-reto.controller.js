'use strict';

angular.module('subexpuestaV2App')
    .controller('CrearRetoCtrl', function($scope, $rootScope, $log, uiGmapGoogleMapApi, Reto, Auth, $location) {

        if (!Auth.isAdmin()) {
            $location.path('/');
        }
        $scope.reto = new Reto();
        $scope.finalizado = false;

        $scope.mensajeError = "";

        $scope.listaRetos = [];
        $scope.retoCreado = false;

        function getRetos() {
            Reto.query({}, function(retos) {
                $scope.listaRetos = retos;
            });
        };

        getRetos();

        $scope.crearReto = function() {

           ///$log.debug('nuevo envento: ' + JSON.stringify($scope.reto, null, 4));


            $scope.reto.$save().then(function(response) {
                $scope.retoCreado = true;
                getRetos();

            });
        };

    });