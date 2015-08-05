'use strict';

angular.module('subexpuestaV2App')
  .controller('SettingsCtrl', function ($scope, Auth, $log) {
    $scope.errors = {};
    $scope.passwordActual = '';
    $scope.renewPassword = '';    
    $scope.user = Auth.getCurrentUser();

    $scope.myImage='';
    $scope.myCroppedImage='';

    $scope.isCollapsed = true;

        $scope.items = [
     { id: 0, name: 'Cuando se publique una localizacion' },
     { id: 1, name: 'Una vez al dia con el resumen' },
     { id: 2, name: 'Una vez a la semana con el resumen' }
   ];//0 -> Cuando se publique una localizacion, 1-> Al finalizar el dia, 2-> Al finalizar la semana

   
    var handleFileSelect=function(evt) {
          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
              $scope.myImage=evt.target.result;
            });
          };
          reader.readAsDataURL(file);
        };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);


    $scope.closeAlert = function() {
      $scope.message = '';
      $scope.errors.other = '';
      $scope.errors.passwordIguales = '';
    };

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      
      if($scope.user.newPassword==='' && $scope.user.newPassword!==$scope.renewPassword )
      {
                
          $scope.errors.passwordIguales = 'Repita la nueva contraseña correctamente';
        
      }
      else
      {
        if(form.$valid) {
          
          $log.debug('frecuenciaAviso: '+$scope.user.frecuenciaAviso);
          Auth.changePassword( $scope.passwordActual, $scope.user.newPassword, $scope.user.name, $scope.user.location, $scope.user.web, $scope.myCroppedImage, $scope.user.participarConcursos, $scope.user.newsletter, $scope.user.urlFacebook, $scope.user.urlTwitter, $scope.user.coordenadasAvisoLatitud, $scope.user.coordenadasAvisoLongitud, $scope.user.radioAviso, $scope.user.frecuenciaAviso)
          .then( function() {
            $scope.message = 'Usuario actualizado correctamente!';
          })
          .catch( function() {
           // form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Contraseña incorrecta';
            $scope.message = '';
          });
        }
      }
		};
  });
