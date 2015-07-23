'use strict';

angular.module('subexpuestaV2App')
    .controller('ListaArticulosCtrl', function($scope, $rootScope, $log, Articulo) {
        $scope.listaArticulos = [];
        $rootScope.title = 'Nuestro Blog. Artículos sobre fotografía nocturna | subexpuesta.com';
        $rootScope.metaDescription = 'Tutoriales, cómo se hizo la fotografía, experiencias, unboxing, linternas, puesta en práctica, vamos... nuestro blog!';



        getArticulos();


        function getArticulos() {
            //console.log('findByTitle(): ' + $stateParams.apunteTitulo);
            Articulo.query({}, function(articulos) {
                $scope.listaArticulos = articulos;
                $log.debug('listaArticulos[0]: ' + JSON.stringify($scope.listaArticulos[0].fechaCreacion));
                $log.debug('listaArticulos[0]: ' + JSON.stringify($scope.listaArticulos[1].fechaCreacion));
            });


        };




    });