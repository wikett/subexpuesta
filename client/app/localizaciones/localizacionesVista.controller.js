'use strict';

angular.module('subexpuestaV2App')
    .controller('LocalizacionesVistaCtrl', function($scope, $rootScope, $log, Localizacion, $stateParams, uiGmapGoogleMapApi, Auth, Modal, $location, Email) {

        $scope.showMap = false;

        $scope.arrayCategorias = ['Nocturna Paisaje','Nocturna Urbana', 'LightPainting', 'Atardecer-Amanecer','Monumentos', 'Ruinas', 'Vehiculos-Maquinarias', 'Mineria','Paisaje','Larga Exposicion Diurna','Urbana', 'Costa'];
       // $scope.imageLocalizacion = [];

        $scope.localizacion = {};
        $scope.listaLocalizaciones = {};
        $scope.localizacionesCercanas = [];

            $scope.isCollapsed = true;
    $scope.mejoraCreada = false;
    $scope.textoReporte = '';

    $scope.images = [];


        $scope.miObjeto = {
            localizaciones: {},
            distancia: {}
        }
        $scope.getCurrentUser = Auth.getCurrentUser();
        $scope.mostrarEditar = false;

        $scope.map = {
            center: {
                latitude: 0,
                longitude: 0
            },
            zoom: 5,
            icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png'
        };

        $scope.marker = {
            id: 0,
            icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
            coords: {
                latitude: 0,
                longitude: 0
            }
        };

        uiGmapGoogleMapApi.then(function(maps) {
            setTimeout(function() {
                $scope.showMap = true;
                $scope.$apply();
            }, 100);
        });

        $scope.delete = Modal.confirm.borrarLocalizacion(function(localizacion) {
            //$log.debug('Dentro modal: '+$stateParams.id);

            $scope.editarLocalizacion = Localizacion.LocalizacionAPI.get({
                id: $stateParams.id
            }, function() {
                $scope.editarLocalizacion.estado = 2;

                $scope.editarLocalizacion.$update().then(function(response) {
                    //$log.debug('Localizacion borrada');
                    $location.path('/tus-localizaciones/' + $scope.getCurrentUser.username);
                });
            });

        });

        



        $scope.guardarReporte = function(){
            
            $scope.enviando = true;
            Email.EmailEnviarContacto.enviarMailContacto({
                direccion: 'subexpuestaweb@gmail.com',
                nombre: 'Wikett',
                asunto: 'Reporte Localizacion',
                mensaje: JSON.stringify($scope.localizacion, null, 4)+"Comentario: "+ $scope.textoReporte
            },function(mensaje) {

                if(mensaje.message==='success'){
                $scope.enviado = true;  
                }
                else
                {
                    $scope.mostrarError = true;
                }
                $scope.enviando = false;
                
                

            });
        }

        $scope.abrirImagen = function(){
            Lightbox.openModal($scope.images, 0);
        }

        function localizacionesMasCercanas(localizacion) {
            if ($scope.localizacionesCercanas.length == 0) {
                $scope.localizacionesCercanas.push(localizacion);
            } else {

            }
        }

        function getLocalizacion() {
            $log.debug('getLocalizacion ENTRO');
            Localizacion.LocalizacionAPI.get({
                id: $stateParams.id
            }, function(localizacionData) {
                if (localizacionData.estado == 2) {
                    $location.path('/');
                } else {
                    $scope.localizacion = localizacionData;
                    $scope.marker.coords.latitude = localizacionData.latitud;
                    $scope.marker.coords.longitude = localizacionData.longitud;
                    $scope.map.center.latitude = localizacionData.latitud;
                    $scope.map.center.longitude = localizacionData.longitud;
                    $scope.marker.icon = 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png';
                    if ($scope.getCurrentUser.username === localizacionData.autor) {
                        $scope.mostrarEditar = true;
                    }

                    //lightbox
                    //var imageLightbox = {};
                    //imageLightbox.url = 'http://res.cloudinary.com/djhqderty/image/upload/v1429114149/' + localizacionData.cloudinaryId + '.jpg';
                    //imageLightbox.thumbUrl = 'http://res.cloudinary.com/djhqderty/image/upload/v1429114149/' + localizacionData.cloudinaryId + '.jpg';
                    //$scope.images.push(imageLightbox);
 
                     
                   // $scope.imageLocalizacion.push(image);

                    // title & meta tags
                    $rootScope.title = localizacionData.titulo + ' por: ' + localizacionData.autor;
                    $rootScope.metaDescription = localizacionData.acceso;

                    $rootScope.titleFB = $rootScope.title;
                    $rootScope.descriptionFB = $rootScope.metaDescription;
                    $rootScope.imageFB = 'http://res.cloudinary.com/djhqderty/image/upload/v1429114149/' + localizacionData.cloudinaryId + '.jpg';
                }
                var loc1 = new google.maps.LatLng(localizacionData.latitud, localizacionData.longitud);
                Localizacion.LocalizacionAPI.query().$promise.then(function(result) {
                    $scope.listaLocalizaciones = result;

                    _.each($scope.listaLocalizaciones, function(loca) {
                        //$log.debug('votos: ' + loca.distanciakm);
                        var loc2 = new google.maps.LatLng(loca.latitud, loca.longitud);
                        var distaciaKM = Math.round(google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2) / 1000);
                        //$log.debug('Distancia: '+ distaciaKM);
                        if (distaciaKM < 500) {
                            //$log.debug('Menor que 100km');
                            if (loca._id != localizacionData._id) {
                                loca.distanciakm = distaciaKM;
                                //$log.debug('miObjeto: ' + JSON.stringify($scope.miObjeto));
                                $scope.localizacionesCercanas.push(loca);
                            }
                        }
                    });
                });

            });


        };

        getLocalizacion();


    })