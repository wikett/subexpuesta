'use strict';

angular.module('subexpuestaV2App')
  .controller('FooterCtrl', function ($scope, $log, Boletin, $timeout) {
    $log.debug('Footer');
    $scope.correo = '';
    $scope.boletinCreado = false;

    function callAtTimeout() {
      console.log("Timeout occurred");
      $scope.boletinCreado = false;
    };

    $scope.guardarEmail = function(){
      $scope.nuevo = new Boletin();
        $scope.nuevo.email = $scope.correo;

        $scope.nuevo.$save().then(function(response){
          $scope.boletinCreado = true;
          $timeout(callAtTimeout, 4000);
        });
    };
  });