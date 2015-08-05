'use strict';

angular.module('subexpuestaV2App')
    .controller('ListaArticulosCtrl', function($scope, $rootScope, $log, Articulo) {
        $scope.listaArticulos = [];
        $rootScope.title = 'Nuestro Blog. Artículos sobre fotografía nocturna | subexpuesta.com';
        $rootScope.metaDescription = 'Tutoriales, cómo se hizo la fotografía, experiencias, unboxing, linternas, puesta en práctica, vamos... nuestro blog!';
        $rootScope.titleFB = 'Nuestro Blog. Artículos sobre fotografía nocturna | subexpuesta.com';
        $rootScope.descriptionFB = 'Tutoriales, cómo se hizo la fotografía, experiencias, unboxing, linternas, puesta en práctica, vamos... nuestro blog!';
        $rootScope.imageFB = 'http://res.cloudinary.com/djhqderty/image/upload/v1431698600/subexpuesta-com-bienvenida_o8bobi.jpg';


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