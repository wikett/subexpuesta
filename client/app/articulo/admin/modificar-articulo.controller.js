


'use strict';

angular.module('subexpuestaV2App')
    .controller('AdminModificarArticulosCtrl', function($scope, $stateParams, $rootScope, $log, Articulo, Auth, $location) {

         if(!Auth.isAdmin())
    {
      $location.path('/');
    }
$scope.model = { id: 0 };
$scope.titulo = '';
$scope.contenido = '';
$scope.contenidoHTML = '';
$scope.autor = '';
$scope.imagen = '';
$scope.articuloModificado = false;
$scope.mensajeError = '';


    function getArticulo() {
           
            Articulo.get({
                id: $stateParams.id
            }, function(articuloData) {
                $scope.titulo = articuloData.titulo;
                $scope.contenido = articuloData.contenido;
                $scope.contenidoHTML = articuloData.contenidoHTML;
                $scope.autor = articuloData.autor;
                $scope.imagen = articuloData.imagen;
                $scope.model.id = articuloData.categoria;
                
            });


        };
      
      getArticulo();

$scope.modificarArticulo = function(){
    
        if(_.isUndefined($scope.titulo))
        {
            $scope.mensajeError = "Por favor, indique el titulo de la fotografia.";         
            return;
        }
        if(_.isUndefined($scope.contenido))
        {
            $scope.mensajeError = "Por favor, indique el contenido ";            
            return;
        }
        if(_.isUndefined($scope.contenidoHTML))
        {
            $scope.mensajeError = "Por favor, indique el contenidoHTML";            
            return;
        }
        else{

                

        $scope.editarArticulo = Articulo.get({id: $stateParams.id}, function(){
          $scope.editarArticulo.titulo = $scope.titulo;
          $scope.editarArticulo.contenido = $scope.contenido;
          $scope.editarArticulo.contenidoHTML = $scope.contenidoHTML;
          $scope.editarArticulo.autor = $scope.autor;
          $scope.editarArticulo.imagen = $scope.imagen;
          $scope.editarArticulo.categoria = $scope.model.id;

          $scope.editarArticulo.$update().then(function(response){
            $scope.articuloModificado = true;
            $scope.mensajeError = "";   
          })
        })

       }
    };

    });
