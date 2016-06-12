'use strict';

angular.module('subexpuestaV2App')
    .controller('CrearEventoCtrl', function($scope, $rootScope, $log, uiGmapGoogleMapApi, Evento, Auth, $location) {

        if (!Auth.isAdmin()) {
            $location.path('/');
        }
        $scope.model = {
            id: 0
        };

        $scope.evento = new Evento();
        $scope.files = {};
        $scope.finalizado = false;
        $scope.mensajeError = "";
        
        $scope.titulo = '';
        $scope.organizador = '';
        $scope.descripcion = '';
        $scope.fecha = '';
        $scope.capacidad = '';
        $scope.eventoCreado = false;

        $scope.opened = false;

        $scope.showMap = false;

        $scope.today = function() {
            $scope.dt = new Date();
        };

        //$scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

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
                        //$log.log('$scope.marker.coords.latitude: ' + $scope.marker.coords.latitude);
                        $scope.marker.coords.latitude = handlerArgs[0].latLng.lat();
                        $scope.marker.coords.longitude = handlerArgs[0].latLng.lng();
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

        $scope.searchbox = {
            template: 'searchbox.tpl.html',
            position: 'RIGHT_TOP',

            events: {
                places_changed: function(searchBox) {
                    var places = searchBox.getPlaces();
                    $log.debug('New place: '+JSON.stringify(places[0],null,4));
                    if (places.length == 0) {
                        return;
                    }
                    $scope.marker.coords.latitude = places[0].geometry.location.lat();
                    $scope.marker.coords.longitude = places[0].geometry.location.lng();
                    $scope.map.center.latitude = places[0].geometry.location.lat();
                    $scope.map.center.longitude = places[0].geometry.location.lng();
                    $scope.map.zoom = 10;
                    

                }
            }

        };

        uiGmapGoogleMapApi.then(function(maps) {
            setTimeout(function() {
                $scope.showMap = true;
                $scope.$apply();
            }, 100);
        });



        $scope.crearEvento = function() {
            $scope.evento.fecha = $scope.dt;
            $scope.evento.longitud = $scope.marker.coords.longitude;
            $scope.evento.latitud = $scope.marker.coords.latitude;
            //$log.debug('nuevo envento: ' + JSON.stringify($scope.evento, null, 4));
            
            
            $scope.evento.$save().then(function(response) {
                $scope.eventoCreado = true;

            });
        };


        $scope.widget = $(".cloudinary_fileupload")
            .unsigned_cloudinary_upload($.cloudinary.config().upload_preset, {
                tags: 'subexpuesta',
                context: 'photo=',
                folder: 'subexpuesta'
            }, {
                // Uncomment the following lines to enable client side image resizing and valiation.
                // Make sure cloudinary/processing is included the js file
                //disableImageResize: false,
                //imageMaxWidth: 800,
                //imageMaxHeight: 600,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
                maxFileSize: 5000000, // 5MB
                dropZone: "#direct_upload_jquery",
                start: function(e) {
                    $scope.status = "Comienza la carga...";
                    $scope.files = {};
                    $scope.$apply();
                },
                fail: function(e, data) {
                    $scope.status = "Error en la carga";
                    $scope.$apply();
                }
            })
            .on("cloudinaryprogress", function(e, data) {
                var name = data.files[0].name;
                var file = $scope.files[name] || {};
                file.progress = Math.round((data.loaded * 100.0) / data.total);
                file.status = "Subiendo... " + file.progress + "%";
                $scope.files[name] = file;
                $scope.$apply();
            })
            .on("cloudinaryprogressall", function(e, data) {
                $scope.progress = Math.round((data.loaded * 100.0) / data.total);
                $scope.status = "Subiendo... " + $scope.progress + "%";
                $scope.$apply();
            })
            .on("cloudinarydone", function(e, data) {
                data.result.context = {
                    custom: {
                        photo: $scope.title
                    }
                };
                $scope.status = "Finalizado correctamente";
                $scope.result = data.result;
                $scope.evento.cloudinaryId = $scope.result.public_id;
                var name = data.files[0].name;
                var file = $scope.files[name] || {};
                file.name = name;
                file.result = data.result;
                $scope.files[name] = file;
                $scope.finalizado = true;
                $scope.$apply();
            });

    });