'use strict';

angular.module('subexpuestaV2App')
  .controller('MejoraCtrl', function ($scope, Mejora, Auth) {

  	$scope.isAdmin = Auth.isAdmin;

  	$scope.listaMejoras = [];
  	$scope.descripcionMejora = '';

  	$scope.isCollapsed = true;
  	$scope.mejoraCreada = false;
    
    $scope.estadosMejoras = ['Pendiente de hacer', 'En proceso...', 'Realizado', 'Rechazado', 'Borrado'];

  	

    function getListaMejoras(){
    	$scope.listaMejoras = Mejora.query(function(){
    	})
    };

    $scope.crearMejora = function(){
    	
        $scope.nuevaMejora = new Mejora();
        $scope.nuevaMejora.descripcion = $scope.descripcionMejora;

        $scope.nuevaMejora.$save().then(function(response){
        	$scope.isCollapsed = true;
        	$scope.descripcionMejora = '';
        	$scope.mejoraCreada = true;
        	$scope.listaMejoras.push(response);
        });
    };

    $scope.actualizarVoto = function(idMejora, valor){
    	console.log('MejoraCtrl actualizarVoto: '+idMejora);
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
