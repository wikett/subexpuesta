'use strict';

angular.module('subexpuestaV2App')
  .controller('AdminMejoraCtrl', function ($scope, $rootScope, Mejora, Auth, $log) {

  	$scope.isAdmin = Auth.isAdmin;
    
    $scope.listaMejoras = [];
  	$scope.descripcionMejora = '';

  	$scope.isCollapsed = true;
  	$scope.mejoraCreada = false;
    $scope.nuevoEstado = 2;
    
    $scope.estadosMejoras = ['Pendiente de hacer', 'En proceso...', 'Realizado', 'Rechazado', 'Borrado'];
    $scope.items = [
     { id: 0, name: 'Pendiente de hacer' },
     { id: 1, name: 'En proceso...' },
     { id: 2, name: 'Realizado' },
     { id: 3, name: 'Rechazado' },
     { id: 4, name: 'Borrado'}
   ];


    function getListaMejoras(){
    	$scope.listaMejoras = Mejora.query(function(){
    	})
    };


    $scope.actualizarVoto = function(idMejora, valor){
    	//console.log('MejoraCtrl actualizarVoto: '+idMejora);
    	$scope.actualizarMejora = Mejora.get({id: idMejora}, function(){
    		if(valor)
    			$scope.actualizarMejora.votos++;
    		else
    			$scope.actualizarMejora.votos--;
    		$scope.actualizarMejora.$update().then(function(response){
        		getListaMejoras();        		
       	 });
    	});
     		
    };

    $scope.actualizarMejora = function(idMejora, nuevoEstado){
      
      $scope.actualizarMejora = Mejora.get({id: idMejora}, function(){
        
        $scope.actualizarMejora.estado = nuevoEstado;

        $scope.actualizarMejora.$update().then(function(response){
            getListaMejoras();            
         });
      });
      $log.debug('nuevo Estado: '+nuevoEstado);

        
    };

     $scope.borrarMejora = function (idMejora) {
     	console.log('MejoraCtrl borrarMejora: '+idMejora);

     	$scope.borrarMejora = Mejora.get({id: idMejora}, function(){
     		$scope.borrarMejora.$delete().then(function(response){
        		getListaMejoras();
     		});
     	});
    };

    getListaMejoras();

  });
