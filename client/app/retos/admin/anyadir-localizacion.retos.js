'use strict';

angular.module('subexpuestaV2App')
    .controller('AnyadirLocalizacionRetosCtrl', function($scope, $rootScope, $log, uiGmapGoogleMapApi, Reto, Auth, $location, $stateParams, RetoLocalizacion) {

        if (!Auth.isAdmin()) {
            $location.path('/');
        }
        $scope.model = {
            id: 0
        };

        

        $scope.files = {};
        $scope.finalizado = false;
        $scope.mensajeError = "";

        $scope.titulo = '';
        $scope.organizador = '';
        $scope.descripcion = '';
        $scope.fecha = '';
        $scope.capacidad = '';
        $scope.retoModificado = false;
        $scope.nuevaLocalizacion = {};

        

        $scope.opened = false;

        $scope.showMap = false;

        $scope.tags = [];



        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.map = {
            center: {
                latitude: 40.399995,
                longitude: -4.087896
            },

            zoom: 6,
            scaleControl: true,
            events: {
                click: function(map, eventName, handlerArgs) {

                    $scope.$apply(function() {
                        //$log.log('click event');
                        //$log.log('latitud: ' + handlerArgs[0].latLng.lat());
                        
                        $scope.marker.coords.latitude = handlerArgs[0].latLng.lat();
                        $scope.marker.coords.longitude = handlerArgs[0].latLng.lng();
                        $scope.marker.icon = 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png';
                        $log.log('$scope.marker.coords.latitude: ' + $scope.marker.coords.latitude);
                    });

                    //$log.log('longitud: '+marker.getPosition().lng());
                }
            }

        };

        $scope.marker = {
            id: 0,
            icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
            coords: {
                latitude: 0,
                longitude: 0
            },
            options: {
                draggable: true
            },
            events: {
                dragend: function(marker, eventName, args) {
                    //$log.log('marker dragend');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();

                }

            }
        };



        uiGmapGoogleMapApi.then(function(maps) {
            setTimeout(function() {
                $scope.showMap = true;
                $scope.$apply();
            }, 100);
        });



        function getReto() {

            Reto.get({
                id: $stateParams.id
            }, function(retoData) {
                $scope.reto = retoData;
                //$scope.marker.coords.latitude = eventoData.latitud;
                //$scope.marker.coords.longitude = eventoData.longitud;
                
                

            });


        };

        getReto();

        $scope.anyadirLocalizacion = function() {
            $scope.localizacionReto = {};
            $scope.localizacionReto.longitud = $scope.marker.coords.longitude;
            $scope.localizacionReto.latitud = $scope.marker.coords.latitude;
            $scope.localizacionReto.nombre = $scope.nuevaLocalizacion.nombre;
            $scope.localizacionReto.descripcion = $scope.nuevaLocalizacion.descripcion;
            $scope.localizacionReto.codigoReto = $scope.nuevaLocalizacion.codigoReto;
            
            $scope.reto.localizaciones.push($scope.localizacionReto);
            
            RetoLocalizacion.update({id: $scope.reto._id}, $scope.localizacionReto);
            
        };


    });