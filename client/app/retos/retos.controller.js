'use strict';

angular.module('subexpuestaV2App')
  .controller('RetosCtrl', function ($scope, Reto) {
    $scope.listaRetos = {};

    function getListaRetos(){
     Reto.query(function(data){
    	$scope.listaRetos = data;
        for (var i = 0; i < $scope.listaRetos.length; i++) {
           var total = data[i].localizaciones.length;
           var recibidas = _.filter(data[i].localizaciones, function(dataL){
                    return dataL.recibida===true;
                });
            recibidas = recibidas.length;
            var porcentaje = recibidas * 100 / total; 
            $scope.listaRetos[i].porcentaje = Math.round(porcentaje * 100) / 100;
        }

    	});
    	
    };
    getListaRetos();

  });
