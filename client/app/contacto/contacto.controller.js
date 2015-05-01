'use strict';

angular.module('subexpuestaV2App')
  .controller('ContactoCtrl', function ($scope, Email, $log) {
    $scope.enviado = false;
    $scope.mostrarError = false;
    $scope.enviando = false;

    $scope.direccion = '';
    $scope.nombre = '';
    $scope.asunto = '';
    $scope.mensaje = '';

     $scope.enviarCorreo = function () {
  	
           $log.debug('Enviando correo...');
           $scope.enviando = true;
            Email.EmailEnviarContacto.enviarMailContacto({
                direccion: $scope.direccion,
                nombre: $scope.nombre,
                asunto: $scope.asunto,
                mensaje: $scope.mensaje
            },function(mensaje) {

                $log.debug('mensaje: '+JSON.stringify(mensaje));
                if(mensaje.message==='success'){
                $scope.enviado = true;	
                }
                else
                {
                	$scope.mostrarError = true;
                }
                $scope.enviando = false;
                //$log.debug('localizacionData.autor: '+localizacionData.autor);
                

            });


        };
  });
