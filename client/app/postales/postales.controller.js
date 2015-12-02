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

            function getLocalizacionesNoviembre() {
            $scope.listaLocalizaciones = Localizacion.LocalizacionAPI.query(function() {


                _.each($scope.listaLocalizaciones, function(loca) {
                    var ret = {
                        id: loca.cloudinaryId,
                        _id: loca._id,
                        autor: loca.autor,
                        tags: loca.tags,
                        latitude: loca.latitud,
                        longitude: loca.longitud,
                        titulo: loca.titulo,
                        idFoto: loca.cloudinaryId,
                        fechaToma: loca.fechaToma,
                        acceso: loca.acceso,
                        peligrosidad: loca.peligrosidad,
                        contaminacion: loca.contaminacionLuminica,
                        notas: loca.notasAdicionales,
                        fechaCreacion: loca.fechaSubida,
                        icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
                        events: {
                            click: function(map, eventName, handlerArgs) {

                                $scope.$apply(function() {
                                    //$log.log('click event');
                                    //$log.log('click: '+JSON.stringify(handlerArgs));
                                    $scope.destinoModal = handlerArgs._id;

                                    $scope.destinoTituloModal = handlerArgs.titulo;
                                    $scope.abrir(handlerArgs);

                                    $scope.fotoActual._id = handlerArgs._id;
                                    $scope.fotoActual.idClodinary = handlerArgs.id;
                                    $scope.fotoActual.tags = handlerArgs.tags;
                                    $scope.fotoActual.autor = handlerArgs.autor;
                                    $scope.fotoActual.titulo = handlerArgs.titulo;
                                    $scope.fotoActual.fechaToma = handlerArgs.fechaToma;
                                    $scope.fotoActual.acceso = handlerArgs.acceso;
                                    $scope.fotoActual.peligrosidad = handlerArgs.peligrosidad;
                                    $scope.fotoActual.contaminacion = handlerArgs.contaminacion;
                                    $scope.fotoActual.notas = handlerArgs.notas;
                                });
                            }
                        }

                    };
                    if(loca.estado!=2)
                        $scope.misLocalizaciones.push(ret);
                });

                var uniqueAutor = _.countBy($scope.misLocalizaciones, "autor");

                
                var fechaEsteMes = new Date($scope.fechaHoy.getFullYear(),10, 1);
                var fechaFinMes = new Date($scope.fechaHoy.getFullYear(),10, 30);
               // $log.debug('fechaEsteMes: ' + fechaEsteMes);

                
                $scope.topUsuariosMensual = _.filter($scope.misLocalizaciones, function(v){
                    var aux = new Date(v.fechaCreacion);
                    return aux > fechaEsteMes
                });

                $scope.topUsuariosMensual = _.filter($scope.topUsuariosMensual, function(v){
                    var aux = new Date(v.fechaCreacion);
                    return aux < fechaFinMes
                });

                $scope.topUsuariosMensual = _.countBy($scope.topUsuariosMensual, "autor");
                $scope.topUsuariosMensual = _.map($scope.topUsuariosMensual, function(value, key) {
                    return {
                        autor: key,
                        total: value
                    };
                });

                //$log.debug('$scope.topUsuariosMensual:'+JSON.stringify($scope.topUsuariosMensual, null, 4));

                $scope.maximo = _.map(uniqueAutor, function(value, key) {
                    return {
                        autor: key,
                        total: value
                    };
                });
                
                $scope.usuarioMaximo = _.max($scope.maximo, "total");

            })
        };


            function getUsuarios() {
                User.query({}, function(usuarios) {
                    $scope.listaUsuarios = usuarios;
                    $scope.listadoGanadores = $filter('filter')($scope.listaUsuarios, function(o) {
                        return o.ganadorPostales === true;
                    });
                });
            };

                getLocalizaciones();
                getUsuarios();
                getLocalizacionesNoviembre();


            });