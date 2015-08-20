'use strict';

angular.module('subexpuestaV2App')
    .controller('FooterCtrl', function($scope, $log, Boletin, $timeout, Localizacion) {
        $scope.correo = '';
        $scope.boletinCreado = false;
        $scope.listaLocalizaciones = {};
        $scope.localizacionRandom = {};

        function callAtTimeout() {
            $scope.boletinCreado = false;
        };

        $scope.guardarEmail = function() {
            $scope.nuevo = new Boletin();
            $scope.nuevo.email = $scope.correo;

            $scope.nuevo.$save().then(function(response) {
                $scope.boletinCreado = true;
                $timeout(callAtTimeout, 4000);
            });
        };


        function getListaLocalizciones() {

            Localizacion.LocalizacionAPI.query().$promise.then(function(result){
              $scope.listaLocalizaciones = result;
              
              var numRandom = Math.floor(Math.random()*$scope.listaLocalizaciones.length);
               $scope.localizacionRandom = $scope.listaLocalizaciones[numRandom];
               //$log.debug('Total: ' + JSON.stringify($scope.localizacionRandom, null, 4));
            });


        };

        getListaLocalizciones();


    });