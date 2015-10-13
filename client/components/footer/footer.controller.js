'use strict';

angular.module('subexpuestaV2App')
    .controller('FooterCtrl', function($scope, $log, Boletin, $timeout, Articulo) {
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
            $scope.nuevo.origen = "footer";

            $scope.nuevo.$save().then(function(response) {
                $scope.boletinCreado = true;
                $timeout(callAtTimeout, 4000);
            });
        };
            //$log.debug('Se ejecuta footer');

            getArticulos();


        function getArticulos() {
            //$log.debug('categoria: ' + $stateParams.categoria);
            Articulo.query({}, function(articulos) {
                //$log.debug(JSON.stringify(articulos, null, 4));
                    $scope.listaArticulos = articulos;    
            });


        };




    });