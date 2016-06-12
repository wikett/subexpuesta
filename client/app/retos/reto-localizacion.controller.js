'use strict';

angular.module('subexpuestaV2App')
    .controller('RetoLocalizacionCtrl', function($scope, $rootScope, $log, $stateParams, Reto, $filter) {
        $scope.localizacion = {};

        function getListaRetos() {
            Reto.query(function(data) {
                $scope.listaRetos = data;
                for (var i = 0; i < $scope.listaRetos.length; i++) {
                    var nombre = $filter('seo')(data[i].nombre);
                    if (nombre === $stateParams.nombre) {
        				$scope.reto = data[i];
                        var listaLocalizaciones = $scope.reto.localizaciones;
                        for (var i = 0; i < listaLocalizaciones.length; i++) {
                            var localizacion = $filter('seo')(listaLocalizaciones[i].nombre);
                            if(localizacion===$stateParams.localizacion){
                                 $scope.localizacion = listaLocalizaciones[i];
                                 console.log('reto: '+JSON.stringify($scope.localizacion));
                        
                                 return;
                            }
                        }
        				
                    }
                }

            });
        };

         getListaRetos();
    });