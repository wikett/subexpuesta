'use strict';

angular.module('subexpuestaV2App')
    .controller('MainCtrl', function($scope, $rootScope, Auth, $log, Localizacion, uiGmapGoogleMapApi, Modal, $filter, $location, User, $window) {
        $scope.isLoggedIn = Auth.isLoggedIn;



        $rootScope.title = 'Localizador de Fotografías Nocturnas | subexpuesta.com';
        $rootScope.titleFB = 'Localizador de Fotografías Nocturnas | subexpuesta.com';
        $rootScope.metaDescription = 'Localizaciones para Fotografías Nocturnas. Busca en el mapa nuevas localizaciones para hacer tus fotografías nocturnas, y comparte las que ya tengas hechas!';
        $rootScope.descriptionFB = 'Localizaciones para Fotografías Nocturnas. Busca en el mapa nuevas localizaciones para hacer tus fotografías nocturnas, y comparte las que ya tengas hechas!';

        $scope.destinoModal = '';
        $scope.destinoTituloModal = '';
        $scope.usuarioMaximo = '';
        $scope.listaUsuarios = {};
        $scope.listaLocalizaciones = {};
        $scope.misLocalizaciones = [];
        $scope.fotoActual = {};

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

        });




        $scope.abrir = Modal.confirm.visitarLocalizacion(function(localizacion) {

            //$location.path('/localizaciones/' + $scope.destinoModal + '/' + $filter('seo')($scope.destinoTituloModal));
            $window.open('/localizaciones/' + $scope.destinoModal + '/' + $filter('seo')($scope.destinoTituloModal));

        });


        function getLocalizaciones() {
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

                var maximo = _.map(uniqueAutor, function(value, key) {
                    return {
                        autor: key,
                        total: value
                    };
                });
                $scope.usuarioMaximo = _.max(maximo, "total");

            })
        };
        getLocalizaciones();


        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };


    });