'use strict';

angular.module('subexpuestaV2App')
    .controller('PostalesCtrl', function($scope, Localizacion, $log, User, $filter) {

            $scope.misLocalizaciones = [];
            $scope.fechaHoy = new Date();
            $scope.listadoGanadores = [];


            $scope.monthMatch = function(month) {
                return function(item) {
                    
                    return moment(item.fechaSubida).format('M') == month;
                };
            };


            function getLocalizaciones() {
                $scope.listaLocalizaciones = Localizacion.LocalizacionAPI.query(function() {})
            };



            function getUsuarios() {
                User.query({}, function(usuarios) {
                    $scope.listaUsuarios = usuarios;
                    $scope.listadoGanadores = $filter('filter')($scope.listaUsuarios, function(o) {
                        return o.ganadorPostales === true;
                    });
                });
            };

                //getLocalizaciones();
                getUsuarios();
                //getLocalizacionesNoviembre();


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

            });