'use strict';

angular.module('subexpuestaV2App')
    .controller('ListaArticulosCtrl', function($scope, $rootScope, $log, Articulo, $stateParams) {
        $scope.listaArticulos = [];
        $rootScope.title = 'Nuestro Blog. Artículos sobre fotografía nocturna | subexpuesta.com';
        $rootScope.metaDescription = 'Tutoriales, cómo se hizo la fotografía, experiencias, unboxing, linternas, puesta en práctica, vamos... nuestro blog!';
        $rootScope.titleFB = 'Nuestro Blog. Artículos sobre fotografía nocturna | subexpuesta.com';
        $rootScope.descriptionFB = 'Tutoriales, cómo se hizo la fotografía, experiencias, unboxing, linternas, puesta en práctica, vamos... nuestro blog!';
        $rootScope.imageFB = 'http://res.cloudinary.com/djhqderty/image/upload/v1431698600/subexpuesta-com-bienvenida_o8bobi.jpg';


        getArticulos();


        function getArticulos() {
            //$log.debug('categoria: ' + $stateParams.categoria);

            var idCategoria = 0;

            switch($stateParams.categoria){
                case "general":
                idCategoria = 0
                break;
                case "afondo":
                idCategoria = 1;
                break;
            }

            Articulo.query({}, function(articulos) {
                $log.debug(JSON.stringify(articulos, null, 4));
                if(_.isUndefined($stateParams.categoria))
                {
                    $scope.listaArticulos = articulos;    
                }
                else
                {
                    $scope.listaArticulos = _.where(articulos, {categoria: idCategoria});
                }
                
            });


        };




    });