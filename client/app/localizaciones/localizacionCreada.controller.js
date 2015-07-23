'use strict';

angular.module('subexpuestaV2App')
  .controller('LocalizacionCreadaCtrl', function ($scope, $log, Localizacion, $stateParams, Auth) {
    
    $scope.getCurrentUser = Auth.getCurrentUser();
      
    $scope.listaLocalizaciones = {};
    //$log.debug('parametro: '+$stateParams.titulo);
    $scope.parametro = $stateParams.id;
    $scope.titulo = $stateParams.titulo;


getLocalizaciones();
      
function getLocalizaciones() {
            //console.log('findByTitle(): ' + $stateParams.apunteTitulo);
            Localizacion.LocalizacionAutor.getByAutor({
                autor: $scope.getCurrentUser.username
            }, function(localizaciones) {
                $scope.listaLocalizaciones = localizaciones;
            });


        };


    })