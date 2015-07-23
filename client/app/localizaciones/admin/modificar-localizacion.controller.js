'use strict';

angular.module('subexpuestaV2App')
  .controller('AdminLocalizacionCtrl', function ($scope, $rootScope, Localizacion, Auth, $log) {

  	$scope.isAdmin = Auth.isAdmin;
    
    $scope.listaLocalizaciones = {};
  	$scope.descripcionMejora = '';

  	$scope.mejoraCreada = false;
    $scope.nuevoEstado = 2;
    
    $scope.items = [
     { id: 0, name: 'Aceptada' },
     { id: 1, name: 'Pendiente de Validar' },
     { id: 2, name: 'Rechazada' }
   ];


    function getListaLocalizciones(){
    	$scope.listaLocalizaciones = Localizacion.LocalizacionAPI.query(function() {
    	})
    };


   $scope.actualizarLocalizacion = function(idLocalizacion, nuevoEstado){
      
      $scope.actualizarLocalizacion = Localizacion.LocalizacionAPI.get({id: idLocalizacion}, function(){
        
        $scope.actualizarLocalizacion.estado = nuevoEstado;

        $scope.actualizarLocalizacion.$update().then(function(response){
            getListaLocalizciones();            
         });
      });
      $log.debug('nuevo Estado: '+nuevoEstado);        
    };

    getListaLocalizciones();

  });
