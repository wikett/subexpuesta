'use strict';

angular.module('subexpuestaV2App')
    .controller('EventoPeticionCtrl', function($scope, $rootScope, $log, Evento, $stateParams, Email) {

        $rootScope.title = 'Añade tu curso de fotografía a www.subexpuesta.com';
        $rootScope.metaDescription = 'Añade tu curso al listado de www.subexpuesta.com, tanto de fotografía nocturna, lightpainting, edición en photoshop o lightroom, o paisajístico. Podrás tener más difusión, poder llegar a más personas y completar tu aforo más fácilmente';
        $rootScope.titleFB = 'Añade tu curso de fotografía a www.subexpuesta.com';
        $rootScope.descriptionFB = 'Añade tu curso al listado de www.subexpuesta.com, tanto de fotografía nocturna, lightpainting, edición en photoshop o lightroom, o paisajístico. Podrás tener más difusión, poder llegar a más personas y completar tu aforo más fácilmente';

        $scope.peticion = {};
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


        $scope.enviarMensaje = function() {
            if (_.isUndefined($scope.peticion.nombre)) {
                $scope.mensajeError = "Por favor, indique su nombre.";
                return;
            }
            if (_.isUndefined($scope.peticion.email)) {
                $scope.mensajeError = "Por favor, indique su email.";
                return;
            }
            if (_.isUndefined($scope.peticion.web)) {
                $scope.mensajeError = "Por favor, indique la web donde se promociona su curso.";
                return;
            }

            $scope.enviando = true;
            Email.EmailEnviarContacto.enviarMailContacto({
                direccion: $scope.peticion.email,
                nombre: $scope.peticion.nombre,
                asunto: "Añade tu curso a www.subexpuesta.com ",
                mensaje: $scope.peticion.web
            },function(mensaje) {

                //$log.debug('mensaje: '+JSON.stringify(mensaje));
                if(mensaje.message==='success'){
                $scope.enviado = true;  
                $scope.mensajeExito = "Su mensaje ha sido enviado correctamente, en la mayor brevedad posible nos pondremos en contacto contigo.";
                $scope.peticion = {};
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