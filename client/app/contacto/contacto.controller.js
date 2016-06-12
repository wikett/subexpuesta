'use strict';

angular.module('subexpuestaV2App')
  .controller('ContactoCtrl', function ($scope, $rootScope, Email, $log, $http) {
    
     $rootScope.title = 'Ponte en contacto con nosotros | subexpuesta.com';
     $rootScope.metaDescription = 'Cualquier problema, sugerencia o incidencia que encuentres con la web, ponte en contacto con nosotros. Lo resolveremos lo más rápido posible!';

     $rootScope.titleFB = 'Ponte en contacto con nosotros | subexpuesta.com';
     $rootScope.descriptionFB = 'Cualquier problema, sugerencia o incidencia que encuentres con la web, ponte en contacto con nosotros. Lo resolveremos lo más rápido posible!';
     $rootScope.imageFB = 'http://www.subexpuesta.com/assets/images/subexpuesta-logo.png';

    $scope.enviado = false;
    $scope.mostrarError = false;
    $scope.enviando = false;

    $scope.direccion = '';
    $scope.nombre = '';
    $scope.asunto = '';
    $scope.mensaje = '';

    $scope.miembros = [];

/*
    $http.get('https://us10.api.mailchimp.com/3.0/lists/3f4454e9b8/members', {
        headers: {'Authorization': 'Basic d2lrZXR0OjY0NTk5ZTQwNTEzMTY4MzVmYTdlNmQxYTRlMWU5MmM0LXVzMTA='}
        }).then(function(data){
            $scope.miembros= data;
        });*/

                /*$http({
                    method: 'GET',
                    url: 'https://us10.api.mailchimp.com/3.0/lists/3f4454e9b8/members',
                    transformRequest: function(data, headersGetter) {
                        var headers = headersGetter();
                        delete headers['Authorization'];
                        headers['Authorization']='Basic d2lrZXR0OjY0NTk5ZTQwNTEzMTY4MzVmYTdlNmQxYTRlMWU5MmM0LXVzMTA=';
                        return headers;
                    }
                })
                    .success(function(response) {
                        $log.debug('response: ' + JSON.stringify(response));
                    })
*/


     $scope.enviarCorreo = function () {
  	
           //$log.debug('Enviando correo...');
           $scope.enviando = true;
            Email.EmailEnviarContacto.enviarMailContacto({
                direccion: $scope.direccion,
                nombre: $scope.nombre,
                asunto: $scope.asunto,
                mensaje: $scope.mensaje
            },function(mensaje) {

                //$log.debug('mensaje: '+JSON.stringify(mensaje));
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
