'use strict';

angular.module('subexpuestaV2App')
    .controller('EditarLocalizacionRetosCtrl', function($scope, $rootScope, $log, uiGmapGoogleMapApi, Reto, Auth, $location, $stateParams, RetoUpdateLocalizacion) {

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
        $scope.selectedLocalizacion = '';
        $scope.selectedComunidad = '';
        $scope.showMap = false;

        $scope.tags = [];
        $scope.comunidades = [{nombre: 'Cataluña', numero: 1}, {nombre: 'Comunidad Valenciana', numero: 2},{nombre: 'Murcia', numero: 3},{nombre: 'Andalucía', numero: 4}, {nombre: 'Galicia', numero: 5}, {nombre: 'Asturias', numero: 6}, {nombre: 'Cantabria', numero: 7}, {nombre: 'Pais Vasco', numero: 8},{nombre: 'Canarias', numero: 9}, {nombre: 'Islas Baleares', numero: 10}, {nombre: 'Ceuta', numero: 11}, {nombre: 'Melilla', numero: 12}];

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

        $scope.cargarDatos = function(){
            console.log($scope.selectedLocalizacion);
            //var objectoSelected = _.where($scope.reto.localizaciones, {_id: $scope.selectedLocalizacion});
            $scope.objectoSelected = $scope.reto.localizaciones[$scope.selectedLocalizacion];
            console.log($scope.objectoSelected._id);
            $scope.nuevaLocalizacion.nombre = $scope.objectoSelected.nombre;
            $scope.nuevaLocalizacion.descripcion = $scope.objectoSelected.descripcion;
            $scope.nuevaLocalizacion.codigoReto = $scope.objectoSelected.codigoReto;
            $scope.marker.coords.latitude = $scope.objectoSelected.latitud;
            $scope.marker.coords.longitude = $scope.objectoSelected.longitud;
            console.log($scope.nuevaLocalizacion);

        }


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

        $scope.editarLocalizacion = function() {
            console.log('Objeto Selected: '+$scope.selectedLocalizacion);
            console.log('$scope.objectoSelected :'+$scope.objectoSelected._id);
            var localizacionReto = {};//$scope.reto.localizaciones[$scope.selectedLocalizacion];
            console.log('localizacionReto._id: '+localizacionReto._id);
            localizacionReto.longitud = $scope.marker.coords.longitude;
            localizacionReto.latitud = $scope.marker.coords.latitude;
            localizacionReto.nombre = $scope.nuevaLocalizacion.nombre;
            localizacionReto.descripcion = $scope.nuevaLocalizacion.descripcion;
            localizacionReto.codigoReto = $scope.nuevaLocalizacion.codigoReto;
            localizacionReto.recibida = $scope.nuevaLocalizacion.recibida;
            localizacionReto.comunidad = $scope.selectedComunidad;
            
        //RetoUpdateLocalizacion.update({id: localizacionReto._id}, localizacionReto);
            
           RetoUpdateLocalizacion.update({id: $scope.objectoSelected._id}, localizacionReto);
            $scope.retoModificado = true;
        };


    });
