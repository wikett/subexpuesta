'use strict';

angular.module('subexpuestaV2App')
    .controller('SingleEventoCtrl', function($scope, $log, $rootScope, Evento, $stateParams, Email) {



        $scope.alumno = {};
        $scope.mensajeError = "";
        $scope.enviado = false;
        $scope.mostrarError = false;
        $scope.enviando = false;
        

        $scope.closeAlert = function() {
            $scope.mensajeError = "";
        };

         $scope.closeMensaje = function() {
            $scope.mensajeExito = "";
        };

        function getEvento() {

            Evento.get({
                id: $stateParams.id
            }, function(eventoData) {
                $scope.eventoActual = eventoData;
                 //$log.debug('eventoData: ' + JSON.stringify(eventoData, null, 4));


                $rootScope.title = eventoData.titulo;
                $rootScope.metaDescription = eventoData.descripcion.substring(0,150)+ '...';
                $rootScope.titleFB = eventoData.titulo;
                $rootScope.descriptionFB = eventoData.descripcion.substring(0,150)+ '...';
                
            });


        };

        getEvento();

        $scope.enviarMensaje = function() {
            if (_.isUndefined($scope.alumno.nombre)) {
                $scope.mensajeError = "Por favor, indique su nombre.";
                return;
            }
            if (_.isUndefined($scope.alumno.email)) {
                $scope.mensajeError = "Por favor, indique su email.";
                return;
            }
            if (_.isUndefined($scope.alumno.mensaje)) {
                $scope.mensajeError = "Por favor, indique el mensaje que quiere enviar.";
                return;
            }

            $scope.enviando = true;
            Email.EmailEnviarContacto.enviarMailContacto({
                organizador: $scope.eventoActual.emailContacto,
                direccion: $scope.alumno.email,
                nombre: $scope.alumno.nombre,
                asunto: "Informacion sobre el curso: "+$scope.eventoActual.titulo,
                mensaje: $scope.alumno.mensaje
            },function(mensaje) {

                //$log.debug('mensaje: '+JSON.stringify(mensaje));
                if(mensaje.message==='success'){
                $scope.enviado = true;  
                $scope.mensajeExito = "Su mensaje ha sido enviado correctamente, en la mayor brevedad posible nos pondremos en contacto contigo.";
                $scope.alumno = {};
                }
                else
                {
                    $scope.mostrarError = true;
                }
                $scope.enviando = false;
                //$log.debug('localizacionData.autor: '+localizacionData.autor);
                

            });



            
        }



    });