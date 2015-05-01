'use strict';

angular.module('subexpuestaV2App')
  .controller('MainCtrl', function ($scope, Auth, Email, $log) {
  	$scope.isLoggedIn = Auth.isLoggedIn;









 $scope.enviarCorreo = function () {
  	
           $log.debug('Enviando correo...');
            Email.EmailEnviar.enviarMail({
                direccion: 'pepito@asdf.com'
            },function(mensaje) {

                $log.debug('mensaje: '+mensaje);
                //$log.debug('localizacionData.autor: '+localizacionData.autor);

            });


        };
      
      //enviarCorreo();






  });
