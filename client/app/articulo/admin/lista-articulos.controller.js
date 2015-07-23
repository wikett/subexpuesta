'use strict';

angular.module('subexpuestaV2App')
    .controller('AdminListaArticulosCtrl', function($scope, $rootScope, $log, Articulo, Auth, $location) {

         if(!Auth.isAdmin())
    {
      $location.path('/');
    }

$scope.listaArticulos = [];

getArticulos();


            function getArticulos() {
                //console.log('findByTitle(): ' + $stateParams.apunteTitulo);
                Articulo.query({}, function(articulos) {
                    $scope.listaArticulos = articulos;
                });


            };

    });


