'use strict';

angular.module('subexpuestaV2App')
    .controller('CrearArticuloCtrl', function($scope, $rootScope, $log, Articulo, Auth, $location) {

         if(!Auth.isAdmin())
    {
      $location.path('/');
    }
$scope.model = { id: 0 };
$scope.titulo = '';
$scope.contenido = '';
$scope.contenidoHTML = '';
$scope.autor = '';
$scope.urlAutor = '';
$scope.imagen = '';
$scope.articuloCreado = false;


    $scope.crearArticulo = function(){
    	
        $scope.nuevoArticulo = new Articulo();
        $scope.nuevoArticulo.titulo = $scope.titulo;
        $scope.nuevoArticulo.contenido = $scope.contenido;
        $scope.nuevoArticulo.contenidoHTML = $scope.contenidoHTML;
        $scope.nuevoArticulo.autor = $scope.autor;
        $scope.nuevoArticulo.urlAutor = $scope.urlAutor;
        $scope.nuevoArticulo.imagen = $scope.imagen;
        $scope.nuevoArticulo.categoria = $scope.model.id;

        $scope.nuevoArticulo.$save().then(function(response){
        	$scope.articuloCreado = true;

        });
    };

    });