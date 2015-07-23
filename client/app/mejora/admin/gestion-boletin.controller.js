'use strict';

angular.module('subexpuestaV2App')
  .controller('AdminBoletinCtrl', function ($scope, $rootScope, Boletin, Auth, $log) {

  	$scope.isAdmin = Auth.isAdmin;
    
    $scope.listaBoletines = {};


    function getListaLocalizciones(){
    	$scope.listaBoletines = Boletin
      .query(function() {
    	})
    };

    getListaLocalizciones();

  });
