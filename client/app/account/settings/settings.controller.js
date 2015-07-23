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
          $log.debug('urlFacebook: '+$scope.user.urlFacebook);
          $log.debug('urlTwitter: '+$scope.user.urlTwitter);
          Auth.changePassword( $scope.passwordActual, $scope.user.newPassword, $scope.user.name, $scope.user.location, $scope.user.web, $scope.myCroppedImage, $scope.user.participarConcursos, $scope.user.newsletter, $scope.user.urlFacebook, $scope.user.urlTwitter)
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
