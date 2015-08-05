'use strict';

angular.module('subexpuestaV2App')
  .controller('SingleArticuloCtrl', function ($scope, $rootScope, $log, Articulo, ArticuloComentario, $stateParams) {
    
    $scope.singleArticulo = {};
    $scope.listaArticulos = [];



    $scope.listaColores = ['#AAAA39', '#9D344B', '#313975', '#E4E47A', '#42000E', '#959ABC', '#474700', '#D37186', '#050A31'];

    $scope.comentarioArticulo = { 
        nombre : '', 
        direccion : '',
        comentario : ''
    };

    getArticulos();
    getArticulo();

    function getArticulos() {
        //console.log('findByTitle(): ' + $stateParams.apunteTitulo);
        Articulo.query({}, function(articulos) {
            $scope.listaArticulos = articulos;
            $log.debug('listaArticulos[0]: ' + JSON.stringify($scope.listaArticulos[0]));
        });


    };

    function getArticulo() {
        //console.log('findByTitle(): ' + $stateParams.apunteTitulo);
        Articulo.get({
            id: $stateParams.id
        }, function(articulo) {
            $scope.singleArticulo = articulo;
            
            $rootScope.title = articulo.titulo+' | subexpuesta.com';
            $rootScope.metaDescription = articulo.contenido.substring(0,150)+ '...';
            $rootScope.titleFB = articulo.titulo+' | subexpuesta.com';
            $rootScope.descriptionFB = articulo.contenido.substring(0,150) + '...';
            $rootScope.imageFB = articulo.imagen;
            
        });


    };


        $scope.enviarComentario = function () {
            $scope.singleArticulo = ArticuloComentario.update({id: $stateParams.id}, $scope.comentarioArticulo);
            $scope.comentarioArticulo = { 
                nombre : '', 
                direccion : '',
                comentario : ''
            };
        };
  });
