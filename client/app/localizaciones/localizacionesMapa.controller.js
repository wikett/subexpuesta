'use strict';

angular.module('subexpuestaV2App')
    .controller('LocalizacionesMapaCtrl', function($scope, $rootScope, $log, Localizacion, uiGmapGoogleMapApi, $filter) {



            $rootScope.title = 'Mapa con Localizaciones de Fotografias Nocturnas';
            $rootScope.metaDescription = 'Descubre localizaciones de fotografias nocturnas cerca de tu zona, o de un nuevo sitio para poder hacer tu version. Juega con el mapa y explora.';
            $rootScope.titleFB = 'Mapa con Localizaciones de Fotografias Nocturnas | subexpuesta.com';
            $rootScope.descriptionFB = 'Descubre localizaciones de fotografias nocturnas cerca de tu zona, o de un nuevo sitio para poder hacer tu version. Juega con el mapa y explora.';
            $rootScope.imageFB = 'http://www.subexpuesta.com/assets/images/subexpuesta-logo.png';

            $scope.busqueda = '';
            $scope.listaLocalizaciones = {};
            $scope.misLocalizaciones = [];
            $scope.misLocalizacionesFiltradas = [];
            $scope.fotoActual = {};
            $scope.showMap = false;

            $scope.filtroPaisaje = false;
            $scope.filtroUrbana = false;
            $scope.filtroLightpainting = false;
            $scope.filtroAtardecer = false;
            $scope.filtroMonumento = false;
            $scope.filtroRuinas = false;
            $scope.filtroVehiculo = false;
            $scope.filtroMineria = false;

                //$scope.filtroPmin = 0;
              // $scope.filtroPmax = 10;

              $scope.resource = {
                "header": [
                  { "name": "Name" },
                  { "star": "Star" },
                  { "sf-Location": "SF Location" }
                ],
                "rows": [
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
                  { "name": "Flywheel Coffee Roasters", "star": "★★★★★", "sf-location": "Upper Haight" }
                ]
                
              };
            $scope.map = {
                center: {
                    latitude: 40.399995,
                    longitude: -4.087896
                },
                zoom: 1,
                bounds: {},
                clusterOptions: {
                    title: 'Hi I am a Cluster!',
                    gridSize: 60,
                    ignoreHidden: true,
                    minimumClusterSize: 2
                    //imageSizes: [72]
                }
            };
            $scope.options = {
                scrollwheel: true
            };

            uiGmapGoogleMapApi.then(function(maps) {
                setTimeout(function() {
                    $scope.showMap = true;
                    $scope.$apply();
                }, 100);
            });

            $scope.$watch("busqueda", function(breweryFilter) {
                //$log.debug('Actualizo busqueda: '+breweryFilter);
                //$scope.filteredMarkers = $filter("filter")($scope.listaLocalizaciones, breweryFilter);
                $scope.misLocalizacionesFiltradas = $filter("filter")($scope.misLocalizaciones, breweryFilter);
                if (!$scope.misLocalizacionesFiltradas) {
                    return;
                }
            });

            $scope.filtrarCategoria = function(tipo) {
                //$log.debug(tipo);
                switch (tipo) {
                    case 'paisaje':
                        {
                            $scope.filtroPaisaje = !$scope.filtroPaisaje;
                            if ($scope.filtroPaisaje) {
                                $scope.misLocalizacionesFiltradas = _.filter($scope.misLocalizaciones, {
                                    categoria: 0
                                });
                              $scope.filtroUrbana = false;
                              $scope.filtroLightpainting = false;
                              $scope.filtroAtardecer = false;
                              $scope.filtroMonumento = false;
                              $scope.filtroRuinas = false;
                              $scope.filtroVehiculo = false;
                              $scope.filtroMineria = false;
                            } else {
                                $scope.misLocalizacionesFiltradas = $scope.misLocalizaciones;
                            }
                           break; 
                        }

                
                case 'urbana':
                    {
                        $scope.filtroUrbana = !$scope.filtroUrbana;
                            if ($scope.filtroUrbana) {
                                $scope.misLocalizacionesFiltradas = _.filter($scope.misLocalizaciones, {
                                    categoria: 1
                                });
                              $scope.filtroPaisaje = false;
                              //$scope.filtroUrbana = false;
                              $scope.filtroLightpainting = false;
                              $scope.filtroAtardecer = false;
                              $scope.filtroMonumento = false;
                              $scope.filtroRuinas = false;
                              $scope.filtroVehiculo = false;
                              $scope.filtroMineria = false;
                            } else {
                                $scope.misLocalizacionesFiltradas = $scope.misLocalizaciones;
                            }
                           break; 
                    }
                case 'lightpainting':
                    {
                        $scope.filtroLightpainting = !$scope.filtroLightpainting;
                        if ($scope.filtroLightpainting) {
                                $scope.misLocalizacionesFiltradas = _.filter($scope.misLocalizaciones, {
                                    categoria: 2
                                });
                              $scope.filtroPaisaje = false;
                              $scope.filtroUrbana = false;
                              //$scope.filtroLightpainting = false;
                              $scope.filtroAtardecer = false;
                              $scope.filtroMonumento = false;
                              $scope.filtroRuinas = false;
                              $scope.filtroVehiculo = false;
                              $scope.filtroMineria = false;
                            } else {
                                $scope.misLocalizacionesFiltradas = $scope.misLocalizaciones;
                            }
                           break; 
                    }
                case 'atardecer':
                    {
                        $scope.filtroAtardecer = !$scope.filtroAtardecer;
                        if ($scope.filtroAtardecer) {
                                $scope.misLocalizacionesFiltradas = _.filter($scope.misLocalizaciones, {
                                    categoria: 3
                                });
                              $scope.filtroPaisaje = false;
                              $scope.filtroUrbana = false;
                              $scope.filtroLightpainting = false;
                              //$scope.filtroAtardecer = false;
                              $scope.filtroMonumento = false;
                              $scope.filtroRuinas = false;
                              $scope.filtroVehiculo = false;
                              $scope.filtroMineria = false;
                            } else {
                                $scope.misLocalizacionesFiltradas = $scope.misLocalizaciones;
                            }
                           break; 
                    }
                case 'monumento':
                    {
                        $scope.filtroMonumento = !$scope.filtroMonumento;
                        if ($scope.filtroMonumento) {
                                $scope.misLocalizacionesFiltradas = _.filter($scope.misLocalizaciones, {
                                    categoria: 4
                                });
                              $scope.filtroPaisaje = false;
                              $scope.filtroUrbana = false;
                              $scope.filtroLightpainting = false;
                              $scope.filtroAtardecer = false;
                              //$scope.filtroMonumento = false;
                              $scope.filtroRuinas = false;
                              $scope.filtroVehiculo = false;
                              $scope.filtroMineria = false;
                            } else {
                                $scope.misLocalizacionesFiltradas = $scope.misLocalizaciones;
                            }
                           break; 
                    }
                case 'ruinas':
                    {
                        $scope.filtroRuinas = !$scope.filtroRuinas;
                        if ($scope.filtroRuinas) {
                                $scope.misLocalizacionesFiltradas = _.filter($scope.misLocalizaciones, {
                                    categoria: 5
                                });
                              $scope.filtroPaisaje = false;
                              $scope.filtroUrbana = false;
                              $scope.filtroLightpainting = false;
                              $scope.filtroAtardecer = false;
                              $scope.filtroMonumento = false;
                              //$scope.filtroRuinas = false;
                              $scope.filtroVehiculo = false;
                              $scope.filtroMineria = false;
                            } else {
                                $scope.misLocalizacionesFiltradas = $scope.misLocalizaciones;
                            }
                           break; 
                    }
                case 'vehiculo':
                    {
                        $scope.filtroVehiculo = !$scope.filtroVehiculo;
                        if ($scope.filtroVehiculo) {
                                $scope.misLocalizacionesFiltradas = _.filter($scope.misLocalizaciones, {
                                    categoria: 6
                                });
                              $scope.filtroPaisaje = false;
                              $scope.filtroUrbana = false;
                              $scope.filtroLightpainting = false;
                              $scope.filtroAtardecer = false;
                              $scope.filtroMonumento = false;
                              $scope.filtroRuinas = false;
                              //$scope.filtroVehiculo = false;
                              $scope.filtroMineria = false;
                            } else {
                                $scope.misLocalizacionesFiltradas = $scope.misLocalizaciones;
                            }
                           break; 
                    }
                case 'mineria':
                    {
                        $scope.filtroMineria = !$scope.filtroMineria;
                        if ($scope.filtroMineria) {
                                $scope.misLocalizacionesFiltradas = _.filter($scope.misLocalizaciones, {
                                    categoria: 7
                                      });
                              $scope.filtroPaisaje = false;
                              $scope.filtroUrbana = false;
                              $scope.filtroLightpainting = false;
                              $scope.filtroAtardecer = false;
                              $scope.filtroMonumento = false;
                              $scope.filtroRuinas = false;
                              $scope.filtroVehiculo = false;
                              //$scope.filtroMineria = false;
                            } else {
                                $scope.misLocalizacionesFiltradas = $scope.misLocalizaciones;
                            }
                           break; 
                    }
            }

        }

        function getLocalizaciones() {
            $scope.listaLocalizaciones = Localizacion.LocalizacionAPI.query(function() {


                _.each($scope.listaLocalizaciones, function(loca) {

                  //$log.debug(loca.categoria);

                    /*if(loca.tags.length>0)
          {
            
            _.each(loca.tags, function(etiqueta){
              $log.debug('etiqueta: '+etiqueta.text);
            })
          }
          $log.debug('etiqueta: '+loca.tags);*/
                    //$log.debug('cloudinaryId: '+loca.cloudinaryId);
                    var str = loca.cloudinaryId;
                    var ret = {
                        _id: loca._id,
                        id: loca.cloudinaryId,
                        autor: loca.autor,
                        tags: loca.tags,
                        latitude: loca.latitud,
                        longitude: loca.longitud,
                        titulo: loca.titulo,
                        //idFoto: str.replace('subexpuesta/',''),
                        idFoto: str,
                        fechaToma: loca.fechaToma,
                        fechaSubida: loca.fechaSubida,
                        acceso: loca.acceso,
                        peligrosidad: loca.peligrosidad,
                        contaminacion: loca.contaminacionLuminica,
                        categoria: loca.categoria,
                        notas: loca.notasAdicionales,
                        icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
                        events: {
                            click: function(map, eventName, handlerArgs) {

                                $scope.$apply(function() {
                                    //$log.log('click event');
                                    //$log.log('click: '+JSON.stringify(handlerArgs));
                                    $scope.fotoActual._id = handlerArgs._id;
                                    $scope.fotoActual.idClodinary = handlerArgs.id;
                                    $scope.fotoActual.tags = handlerArgs.tags;
                                    $scope.fotoActual.autor = handlerArgs.autor;
                                    $scope.fotoActual.titulo = handlerArgs.titulo;
                                    $scope.fotoActual.fechaToma = handlerArgs.fechaToma;
                                    $scope.fotoActual.fechaSubida = handlerArgs.fechaSubida;
                                    $scope.fotoActual.acceso = handlerArgs.acceso;
                                    $scope.fotoActual.peligrosidad = handlerArgs.peligrosidad;
                                    $scope.fotoActual.contaminacion = handlerArgs.contaminacion;
                                    $scope.fotoActual.notas = handlerArgs.notas;


                                    //$log.log('$scope.fotoActual '+JSON.stringify($scope.fotoActual));
                                    //  $scope.marker.coords.latitude = handlerArgs[0].latLng.lat();
                                    //$scope.marker.coords.longitude = handlerArgs[0].latLng.lng();
                                });
                            }
                        }

                    };
                    //ret[idKey] = loca.cloudinaryId;
                    if (loca.estado != 2)
                        $scope.misLocalizaciones.push(ret);
                });

                $scope.misLocalizacionesFiltradas = $scope.misLocalizaciones;
                console.log(JSON.stringify($scope.misLocalizaciones[1]));

            })
        }; getLocalizaciones();



})