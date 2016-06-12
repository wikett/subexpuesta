'use strict';

angular.module('subexpuestaV2App')
    .controller('SettingsCtrl', function($scope, Auth, $log, uiGmapGoogleMapApi) {
        $scope.errors = {};
        $scope.passwordActual = '';
        $scope.renewPassword = '';
        $scope.user = Auth.getCurrentUser();

        $scope.myImage = '';
        $scope.myCroppedImage = '';

        $scope.isCollapsed = true;
        $scope.cancelarAvisos = false;
        $scope.radioMetros = 0;

        $scope.isCollapsedAvisador = false;
        $scope.contactoNuevo = {};
        $scope.errorContactoNuevo = false;
        $scope.borrarContactoNuevo = false;
        $scope.editandoContacto = false;



        $scope.items = [{
            id: 0,
            name: '-Elija cuando quiere recibir los avisos'
        }, {
            id: 1,
            name: 'Una vez al dia'
        }, {
            id: 2,
            name: 'Una vez a la semana'
        }, {
            id: 3,
            name: 'Una vez al mes'
        }]; //0 -> Al finalizar el dia, 1-> Al finalizar la semana 2-> Al mes

        $scope.exito = ['Datos actualizados correctamente', 'Avisos creados correctamente', 'Tu contraseña ha sido cambiada correctamente', 'Contacto añadido correctamente'];
        $scope.numeroGuardar = '-1';


        $scope.map = {
            center: {
                latitude: 40.399995,
                longitude: -4.087896
            },

            zoom: 5,
            events: {
                click: function(map, eventName, handlerArgs) {

                    $scope.$apply(function() {
                        //$log.log('click event');
                        //$log.log('latitud: ' + handlerArgs[0].latLng.lat());
                        //$log.log('$scope.marker.coords.latitude: ' + $scope.marker.coords.latitude);
                        $scope.marker.coords.latitude = handlerArgs[0].latLng.lat();
                        $scope.marker.coords.longitude = handlerArgs[0].latLng.lng();
                        $scope.user.coordenadasAvisoLatitud = $scope.marker.coords.latitude;
                        $scope.user.coordenadasAvisoLongitud = $scope.marker.coords.longitude;
                        $scope.map.circle.center.latitude = $scope.marker.coords.latitude;
                        $scope.map.circle.center.longitude = $scope.marker.coords.longitude;
                        $scope.marker.icon = 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png';
                    });

                    //$log.log('longitud: '+marker.getPosition().lng());
                }
            }

        };

        $scope.marker = {
            id: 0,
            icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
            coords: {
                latitude: $scope.user.coordenadasAvisoLatitud,
                longitude: $scope.user.coordenadasAvisoLongitud
            },
            options: {
                draggable: true
            },
            events: {
                dragend: function(marker, eventName, args) {
                    //$log.log('marker dragend');
                    $scope.user.coordenadasAvisoLatitud = marker.getPosition().lat();
                    $scope.user.coordenadasAvisoLongitud = marker.getPosition().lng();
                    $scope.map.circle.center.latitude = $scope.user.coordenadasAvisoLatitud;
                    $scope.map.circle.center.longitude = $scope.user.coordenadasAvisoLongitud;



                }

            }
        };

        $scope.map.circle = {
            id: 1,
            center: {
                latitude: $scope.user.coordenadasAvisoLatitud,
                longitude: $scope.user.coordenadasAvisoLongitud
            },
            radius: 10000,
            stroke: {
                color: '#08B21F',
                weight: 2,
                opacity: 1
            },
            fill: {
                color: '#08B21F',
                opacity: 0.5
            },
            geodesic: false, // optional: defaults to false
            draggable: false, // optional: defaults to false
            clickable: false, // optional: defaults to true
            editable: false, // optional: defaults to false
            visible: true, // optional: defaults to true
            events: {
                radius_changed: function() {
                    //window.alert("circle radius radius_changed");
                    //console.log("circle radius radius_changed: " + $scope.map.circle.radius);


                }
            }
        };

        uiGmapGoogleMapApi.then(function(maps) {
            setTimeout(function() {
                $scope.showMap = true;
                $scope.$apply();
            }, 100);
        });


        
        
      /*  $scope.slider = {
    value: $scope.user.radioAviso,
        options: {
        floor: 0,
        ceil: 300,
        step: 1
    }

};
        $scope.sliderFlag = true;


    $scope.$watch('slider', function() {
        // do something here
        //console.log('$scope.slider.value: '+$scope.slider.value);
         if ($scope.map !== undefined) {
                $scope.map.circle.radius = $scope.slider.value*1000;
            }
        }, true);*/
        $scope.sliderValue = $scope.user.radioAviso;

        $scope.sliderChange = function() {
            //console.log("slider value changed : " + $scope.sliderValue);
            //$scope.map.circle
            if ($scope.map !== undefined) {
                $scope.map.circle.radius = $scope.sliderValue * 1000;
            }
        };
        $scope.$watch('sliderValue', function() {
            $scope.sliderChange();
        });




        var handleFileSelect = function(evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function(evt) {
                $scope.$apply(function($scope) {
                    $scope.myImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);


        $scope.closeAlert = function() {
            $scope.message = '';
            $scope.errors.other = '';
            $scope.errors.contactoNuevo = '';
            $scope.errors.passwordIguales = '';
            $scope.numeroGuardar = '-1';
        };

        $scope.actualizarDatos = function(form, numero) {

            $scope.numeroGuardar = numero;
            changePassword(form, numero);
        };

        $scope.borrarContacto = function(usuarioCopia, index){
          $scope.borrarContactoNuevo = true;
          //$log.debug('borrarContacto: '+JSON.stringify(usuarioCopia));
          $log.debug('borrarContacto: '+index);
          $scope.contactoNuevo.nombre = usuarioCopia.nombre;
          $scope.contactoNuevo.email = usuarioCopia.email;
          $scope.contactoNuevo.index = index;
          $scope.isCollapsedAvisador = false;

        };

        $scope.cancelarBorrarContacto = function(){
          $scope.contactoNuevo = {};
          $scope.borrarContactoNuevo = false;
        };
        $scope.removeContacto = function(form){
          //$log.debug('$scope.contactoNuevo.index: '+$scope.contactoNuevo.index);
          //$log.debug('ANTES borrarContacto: '+JSON.stringify($scope.user.contactosAvisos,null, 4));
          $scope.user.contactosAvisos.splice($scope.contactoNuevo.index,1);
          //$log.debug('DESPUES borrarContacto: '+JSON.stringify($scope.user.contactosAvisos,null, 4));
          changePassword(form,3);
          $scope.contactoNuevo = {};
          $scope.borrarContactoNuevo = false;
          //$log.debug('MAS DESPUES $scope.contactoNuevo.index: '+$scope.contactoNuevo.index);
        };

        $scope.expandirNuevoContacto = function(){
          $scope.contactoNuevo = {};
          $scope.borrarContactoNuevo = false;
          $scope.isCollapsedAvisador= !$scope.isCollapsedAvisador;
          $scope.editandoContacto = false;

        };

        $scope.modificarContactoAviso = function(usuarioCopia, index){
          $scope.contactoNuevo = {};
          $scope.isCollapsedAvisador= !$scope.isCollapsedAvisador;
          $scope.contactoNuevo.nombre = usuarioCopia.nombre;
          $scope.contactoNuevo.email = usuarioCopia.email;
          $scope.contactoNuevo.index = index;
          $scope.editandoContacto = true;
          $scope.borrarContactoNuevo = false;
        }

        $scope.cancelarEdicionContacto = function(){
          $scope.editandoContacto = false;
          $scope.contactoNuevo = {};
          $scope.isCollapsedAvisador = false;
        }

        $scope.changeContactoAviso = function(form){
          


            if (_.isUndefined($scope.contactoNuevo.nombre)) {
                $scope.errors.contactoNuevo = "Por favor, indique el nombre del contacto.";
            } else {
                if (!_.isUndefined($scope.contactoNuevo.email)) {
                    $scope.user.contactosAvisos[$scope.contactoNuevo.index].nombre = $scope.contactoNuevo.nombre;
                    $scope.user.contactosAvisos[$scope.contactoNuevo.index].email = $scope.contactoNuevo.email;
                    changePassword(form,3);
                    $scope.contactoNuevo = {};
                } else {
                    $scope.errors.contactoNuevo = "Por favor, indique el e-mail del contacto.";
                }
            }
        }

        $scope.addContactoAviso = function(form) {

            if (_.isUndefined($scope.contactoNuevo.nombre)) {
                $scope.errors.contactoNuevo = "Por favor, indique el nombre del contacto.";
            } else {
                if (!_.isUndefined($scope.contactoNuevo.email)) {
                    $log.debug('addContactoAviso: ' + JSON.stringify($scope.contactoNuevo));
                    $scope.user.contactosAvisos.push($scope.contactoNuevo);
                    changePassword(form, 3);
                } else {
                    $scope.errors.contactoNuevo = "Por favor, indique el e-mail del contacto.";
                }
            }

        };

        function changePassword(form, numero) {
            $scope.submitted = true;

            if ($scope.user.newPassword === '' && $scope.user.newPassword !== $scope.renewPassword) {

                $scope.errors.passwordIguales = 'Repita la nueva contraseña correctamente';

            } else {
                if (form.$valid) {

                    //$log.debug('frecuenciaAviso: '+$scope.user.frecuenciaAviso);
                    Auth.changePassword($scope.passwordActual, $scope.user.newPassword, $scope.user.name, $scope.user.location, $scope.user.web, $scope.myCroppedImage, $scope.user.participarConcursos, $scope.user.newsletter, $scope.user.urlFacebook, $scope.user.urlTwitter, $scope.user.coordenadasAvisoLatitud, $scope.user.coordenadasAvisoLongitud, $scope.sliderValue, $scope.user.frecuenciaAviso, $scope.user.contactosAvisos)
                        .then(function() {
                            $scope.message = $scope.exito[numero];
                            if (numero == 3) {
                                $scope.isCollapsedAvisador = false;
                                $scope.contactoNuevo = {};
                                $scope.errorContactoNuevo = false;
                            }
                        })
                        .catch(function() {
                            // form.password.$setValidity('mongoose', false);
                            $scope.errors.other = 'Contraseña incorrecta';
                            $scope.message = '';
                        });
                }
            }
        };
    });