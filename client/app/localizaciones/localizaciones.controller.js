'use strict';

angular.module('subexpuestaV2App')
    .controller('LocalizacionesCtrl', function($scope, $rootScope, $http, $log, $location, Localizacion, uiGmapGoogleMapApi, Auth, Modal, $filter, Usuario, User, UsuarioAviso) {

        $scope.getCurrentUser = Auth.getCurrentUser();

        $rootScope.title = 'Localizaciones Fotografía Nocturna';
        $rootScope.metaDescription = 'Mapa de todo el mundo con las mejores localizaciones de fotografía nocturna que te puedas encontrar!';
        $rootScope.titleFB = 'Localizaciones Fotografía Nocturna';
        $rootScope.descriptionFB = 'Mapa de todo el mundo con las mejores localizaciones de fotografía nocturna que te puedas encontrar!';
        $rootScope.imageFB = 'http://www.subexpuesta.com/assets/images/subexpuesta-logo.png';

        $scope.localizacion = {};
        $scope.localizacionCreada = false;
        $scope.files = {};
        $scope.finalizado = false;
        $scope.mensajeError = "";

        $scope.rate = 0;
        $scope.rateCL = 0;
        $scope.max = 10;
        $scope.isReadonly = false;
        $scope.showMap = false;


        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };
        $scope.hoveringOverCL = function(value) {
            $scope.overStarCL = value;
            $scope.percentCL = 100 * (value / $scope.max);
        };



        $scope.ratingStates = [{
            stateOn: 'glyphicon-ok-sign',
            stateOff: 'glyphicon-ok-circle'
        }, {
            stateOn: 'glyphicon-star',
            stateOff: 'glyphicon-star-empty'
        }, {
            stateOn: 'glyphicon-heart',
            stateOff: 'glyphicon-ban-circle'
        }, {
            stateOn: 'glyphicon-heart'
        }, {
            stateOff: 'glyphicon-off'
        }];

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

        $scope.closeAlert = function() {
            $scope.mensajeError = "";
        };

        $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[3];




         $scope.defaultBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(44.399995, 4.087896),
                    new google.maps.LatLng(40.66541, -4.31715));
        $scope.map = {
            center: {
                latitude: 40.399995,
                longitude: -4.087896
            },

            zoom: 6,
            events: {
                click: function(map, eventName, handlerArgs) {

                    $scope.$apply(function() {
                        $scope.marker.coords.latitude = handlerArgs[0].latLng.lat();
                        $scope.marker.coords.longitude = handlerArgs[0].latLng.lng();
                        $scope.marker.icon = 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png';
                    });
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
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                }
            }
        };

        $scope.searchbox = {
            template: 'searchbox.tpl.html',
            //position:'top-right',
            position: 'top-left',
            options: {
                bounds: {},
                visible: true
            },
            events: {
                places_changed: function(searchBox) {

                    var places = searchBox.getPlaces();
                    //$log.debug('places total: ' + JSON.stringify(places, null, 4));
                    //$log.debug('places total: ' + places.length);
                    if (places.length == 0) {
                        return;
                    }
                    // For each place, get the icon, place name, and location.
                    var newMarkers = [];
                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0, place; place = places[i]; i++) {
                        // Create a marker for each place.
                        var marker = {
                            id: i,
                            place_id: place.place_id,
                            name: place.name,
                            latitude: place.geometry.location.lat(),
                            longitude: place.geometry.location.lng(),
                            options: {
                                visible: false
                            },
                            templateurl: 'window.tpl.html',
                            templateparameter: place
                        };
                        newMarkers.push(marker);

                        bounds.extend(place.geometry.location);
                    }

                    $scope.map.bounds = {
                        northeast: {
                            latitude: bounds.getNorthEast().lat(),
                            longitude: bounds.getNorthEast().lng()
                        },
                        southwest: {
                            latitude: bounds.getSouthWest().lat(),
                            longitude: bounds.getSouthWest().lng()
                        }
                    }

                    _.each(newMarkers, function(marker) {

                        marker.closeClick = function() {
                            $scope.selected.options.visible = false;
                            marker.options.visble = false;
                            //$log.debug('click closeClick');
                            return $scope.$apply();
                        };
                        marker.onClicked = function() {
                            $scope.selected.options.visible = false;
                            $scope.selected = marker;
                            //$log.debug('click onClicked');
                            $scope.selected.options.visible = true;
                        };
                    });
                    //$log.debug('newMarkers '+JSON.stringify(newMarkers[0],null,4));

                    //$scope.map.markers = newMarkers;
                    //$scope.map.center.latitude = newMarkers[0].latitude;
                    //$scope.map.center.latitude = newMarkers[0].longitude;
                    //$scope.marker = newMarkers;
                    $scope.map.zoom = 12;
                }
            }
        }; // fin searchbox

        uiGmapGoogleMapApi.then(function(maps) {
            setTimeout(function() {
               

                //maps.visualRefresh = true;
               


                $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());

                $scope.showMap = true;
                $scope.$apply();

            }, 100);
        });



       /* angular.extend($scope, {
            selected: {
                options: {
                    visible: false

                },
                templateurl: 'window.tpl.html',
                templateparameter: {}
            },
            map: {
                control: {},
                center: {
                    latitude: 40.74349,
                    longitude: -73.990822
                },
                zoom: 12,
                dragging: false,
                bounds: {},
                markers: [],
                idkey: 'place_id',
                events: {
                    idle: function(map) {

                    },
                    dragend: function(map) {
                        //update the search box bounds after dragging the map
                        var bounds = map.getBounds();
                        var ne = bounds.getNorthEast();
                        var sw = bounds.getSouthWest();
                        $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
                        //$scope.searchbox.options.visible = true;
                    }
                }
            },
            searchbox: {
                template: 'searchbox.tpl.html',
                //position:'top-right',
                position: 'top-left',
                options: {
                    bounds: {},
                    visible: true
                },
                //parentdiv:'searchBoxParent',
                events: {
                    places_changed: function(searchBox) {

                        var places = searchBox.getPlaces();
                        $log.debug('places: ' + JSON.stringify(places, null, 4));
                        if (places.length == 0) {
                            return;
                        }
                        // For each place, get the icon, place name, and location.
                        var newMarkers = [];
                        var bounds = new google.maps.LatLngBounds();
                        for (var i = 0, place; place = places[i]; i++) {
                            // Create a marker for each place.
                            var marker = {
                                id: i,
                                place_id: place.place_id,
                                name: place.name,
                                latitude: place.geometry.location.lat(),
                                longitude: place.geometry.location.lng(),
                                zoom: 12,
                                options: {
                                    visible: false
                                },
                                templateurl: 'window.tpl.html',
                                templateparameter: place
                            };
                            newMarkers.push(marker);

                            bounds.extend(place.geometry.location);
                        }

                        $scope.map.bounds = {
                            northeast: {
                                latitude: bounds.getNorthEast().lat(),
                                longitude: bounds.getNorthEast().lng()
                            },
                            southwest: {
                                latitude: bounds.getSouthWest().lat(),
                                longitude: bounds.getSouthWest().lng()
                            }
                        }

                        _.each(newMarkers, function(marker) {

                            marker.closeClick = function() {
                                $scope.selected.options.visible = false;
                                marker.options.visble = false;
                                $log.debug('click closeClick');
                                return $scope.$apply();
                            };
                            marker.onClicked = function() {
                                $scope.selected.options.visible = false;
                                $scope.selected = marker;
                                $log.debug('click onClicked');
                                $scope.selected.options.visible = true;
                            };
                        });

                        $scope.map.markers = newMarkers;
                        $scope.map.zoom = 12;
                    }
                }
            }
        });
*/





        $scope.crearLocalizacion = function() {

            if ($scope.marker.coords.latitude === 0) {
                $scope.mensajeError = "Por favor, indique la localización de la fotografía en el mapa.";
                return;
            }
            if (_.isUndefined($scope.localizacion.titulo)) {
                $scope.mensajeError = "Por favor, indique el titulo de la fotografia.";
                return;
            }
            if (_.isUndefined($scope.dt)) {
                $scope.mensajeError = "Por favor, indique la fecha de cuando fue tomada la fotografia.";
                return;
            }
            if (_.isUndefined($scope.localizacion.cloudinaryId)) {
                $scope.mensajeError = "Por favor, seleccione la imagene que quiere subir.";
                return;
            }
            if (_.isUndefined($scope.localizacion.acceso)) {
                $scope.mensajeError = "Por favor, indique el acceso a la localizacion para realizar la fotografia.";
                return;
            }
            if ($scope.rate === 0) {
                $scope.mensajeError = "Por favor, valore peligrosidad de la zona de acceso al lugar de la fotografia.";
                return;
            }

            if (_.isUndefined($scope.localizacion.categoria)) {
                $scope.mensajeError = "Por favor, indique la categoria de la fotografia.";
                return;
            }
            if ($scope.localizacion.categoria < 8)
                if ($scope.rateCL === 0) {
                    $scope.mensajeError = "Por favor, valore la contaminacion luminica del lugar de la fotografia.";
                    return;
                } else {

                    $scope.nuevaLocalizacion = new Localizacion.LocalizacionAPI();
                    $scope.nuevaLocalizacion.titulo = $scope.localizacion.titulo;


                    $scope.listaEtiquetas = [];
                    //$log.debug('tags: '+JSON.stringify($scope.tags));
                    if ($scope.tags.length > 0)
                        _.each($scope.tags, function(etiqueta) {
                            //$log.debug('etiqueta: '+etiqueta.text);
                            $scope.listaEtiquetas.push(etiqueta.text);
                        })

                    //$log.debug('$scope.rateCL: ' + $scope.rateCL);
                    $scope.nuevaLocalizacion.tags = $scope.listaEtiquetas;
                    $scope.nuevaLocalizacion.autor = $scope.getCurrentUser.username;
                    $scope.nuevaLocalizacion.cloudinaryId = $scope.localizacion.cloudinaryId;
                    $scope.nuevaLocalizacion.fechaToma = $scope.dt;
                    $scope.nuevaLocalizacion.acceso = $scope.localizacion.acceso;
                    $scope.nuevaLocalizacion.peligrosidad = $scope.rate;
                    $scope.nuevaLocalizacion.contaminacionLuminica = $scope.rateCL;
                    $scope.nuevaLocalizacion.notasAdicionales = $scope.localizacion.notasAdicionales;
                    $scope.nuevaLocalizacion.latitud = $scope.marker.coords.latitude;
                    $scope.nuevaLocalizacion.longitud = $scope.marker.coords.longitude;
                    $scope.nuevaLocalizacion.categoria = $scope.localizacion.categoria;




                    //$log.debug('$scope.nuevaLocalizacion: '+JSON.stringify($scope.nuevaLocalizacion));

                    //$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452')
                    //$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+$scope.nuevaLocalizacion.latitud+','+$scope.nuevaLocalizacion.longitud)
                    $http({
                        method: 'GET',
                        url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.nuevaLocalizacion.latitud + ',' + $scope.nuevaLocalizacion.longitud,
                        //url: 'http://ws.spotify.com/search/1/artist.json?q=mecano',

                        transformRequest: function(data, headersGetter) {
                            var headers = headersGetter();
                            //$log.debug('header: '+JSON.stringify(headers));
                            delete headers['Authorization'];
                            //delete headers['X-Requested-With'];
                            //res.header("Access-Control-Allow-Origin", "*");
                            //res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
                            //res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
                            //headers['Accept']='text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*';
                            //headers['Access-Control-Allow-Origin']='*';
                            //headers['Access-Control-Allow-Headers']='*';
                            //headers['Access-Control-Allow-Methods']='GET, PUT, POST';
                            //$log.debug('header AFTER: '+JSON.stringify(headers));
                            //$log.debug('header AFTER: '+JSON.stringify(headers));
                            return headers;
                        }
                    })
                        .success(function(result) {
                            //$log.debug('response: '+JSON.stringify(result));
                            if (result.results.length > 0) {
                                //$log.debug('La llamada termindo exitosa: ' + result.results[0].formatted_address);
                                $scope.nuevaLocalizacion.direccion = result.results[0].formatted_address;
                            }

                        })
                        .finally(function() {
                            //$log.debug('Entro en finally');
                            $scope.nuevaLocalizacion.$save().then(function(response) {
                                $scope.localizacionCreada = true;
                                //Agregar aviso
                                User.query({}, function(usuarios) {
                                    _.each(usuarios, function(usuario) {
                                        //$log.debug('usuario.username: ' + usuario.username + ' $scope.getCurrentUser.username: ' + $scope.getCurrentUser.username);
                                        if (usuario.radioAviso > 0 && usuario.username != $scope.getCurrentUser.username) {
                                            var loc1 = new google.maps.LatLng($scope.marker.coords.latitude, $scope.marker.coords.longitude);
                                            var loc2 = new google.maps.LatLng(usuario.coordenadasAvisoLatitud, usuario.coordenadasAvisoLongitud);
                                            var distaciaKM = Math.round(google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2) / 1000);
                                            var nuevoAviso = {
                                                titulo: $scope.localizacion.titulo,
                                                autor: $scope.getCurrentUser.username,
                                                distanciakm: distaciaKM,
                                                imagen: 'http://res.cloudinary.com/djhqderty/image/upload/c_fit,w_340/v1/' + $scope.localizacion.cloudinaryId + '.jpg',
                                                url: 'http://www.subexpuesta.com/localizaciones/' + response._id + '/' + $filter('seo')(response.titulo)
                                            }
                                            if (distaciaKM < usuario.radioAviso) {
                                                UsuarioAviso.update({
                                                    id: usuario._id
                                                }, nuevoAviso);

                                            }
                                        }
                                    });
                                });






                                $location.path('/localizacion-creada/' + response._id + '/' + $filter('seo')(response.titulo));
                            });
                        });



                }
        };

        $scope.modalCreada = Modal.confirm.localizacionCreada(function(response) {
            //$log.debug('Dentro modal: ');
            $location.path('/localizacion-creada');
        });

        $scope.updateTitle = function() {
            var uploadParams = $scope.widget.fileupload('option', 'formData');
            uploadParams["context"] = "photo=" + $scope.title;
            $scope.widget.fileupload('option', 'formData', uploadParams);
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
                $scope.localizacion.cloudinaryId = $scope.result.public_id;
                var name = data.files[0].name;
                var file = $scope.files[name] || {};
                file.name = name;
                file.result = data.result;
                $scope.files[name] = file;
                $scope.finalizado = true;
                $scope.$apply();
            });



    });

angular.module('subexpuestaV2App').controller('ModalInstanceCtrl', function($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function() {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});