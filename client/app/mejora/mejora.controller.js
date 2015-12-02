'use strict';

angular.module('subexpuestaV2App')
  .controller('MejoraCtrl', function ($scope, $rootScope, Mejora, Auth) {

  	$scope.isAdmin = Auth.isAdmin;

    $rootScope.title = 'Mejora la web | subexpuesta.com';
    $rootScope.metaDescription = 'Cualquier sugerencia que se te ocurra, un problema que encuentres, alguna funcionalidad nueva que te gustaría que apareciera en la web o cualquier comentario para mejorar la web es bienvenido.';

  	$scope.listaMejoras = [];
  	$scope.descripcionMejora = '';

  	$scope.isCollapsed = true;
  	$scope.mejoraCreada = false;
    $scope.textoReporte = '';
    
    $scope.estadosMejoras = ['Pendiente de hacer', 'En proceso...', 'Realizado', 'Rechazado', 'Borrado'];

  	console.log(primepalindrome());

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

    function isPrime(n) {

   // If n is less than 2 or not an integer then by definition cannot be prime.
   if (n < 2) {return false}
   if (n != Math.round(n)) {return false}

   // Now assume that n is prime, we will try to prove that it is not.
   var isPrime = true;

   // Now check every whole number from 2 to the square root of n. If any of these divides n exactly, n cannot be prime.
   for (var i = 2; i <= Math.sqrt(n); i++) {
      if (n % i == 0) {isPrime = false}
   }

   // Finally return whether n is prime or not.
   return isPrime;

}

function palindrome(str) {
    var len = str.length;
    for ( var i = 0; i < Math.floor(len/2); i++ ) {
        if (str[i] !== str[len - 1 - i]) {
            return false;
        }
    }
    return true;
}

    function primepalindrome(){
      var i=1000;
      var result;
      while(i>921){

        if(isPrime(i))
          if(palindrome(i))
            result = i;
        i--;
      }
      return result;
    }

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
