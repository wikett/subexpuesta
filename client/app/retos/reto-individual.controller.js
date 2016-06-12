'use strict';

angular.module('subexpuestaV2App')
    .controller('RetoIndividualCtrl', function($scope, $rootScope, $log, $stateParams, Reto, $filter, $location,Localizacion) {
        $scope.reto = {};

        function getListaRetos() {
            Reto.query(function(data) {
                $scope.listaRetos = data;
                for (var i = 0; i < $scope.listaRetos.length; i++) {
                    var nombre = $filter('seo')(data[i].nombre);
                    if (nombre === $stateParams.nombre) {
                        $scope.reto = data[i];
                        //console.log('reto: ' + JSON.stringify($scope.reto));
                        cargarMapa();
                        return;
                    }
                }

            });

        };

        function setMarkers(map) {
            // Adds markers to the map.

            // Marker sizes are expressed as a Size of X,Y where the origin of the image
            // (0,0) is located in the top left of the image.

            // Origins, anchor positions and coordinates of the marker increase in the X
            // direction to the right and in the Y direction down.
            var image = {
                url: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
                // This marker is 20 pixels wide by 32 pixels high.
                size: new google.maps.Size(32, 32),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(0, 32)
            };

            var puntos = $scope.reto.localizaciones;
            for (var i = 0; i < puntos.length; i++) {
                var punto = puntos[i];
                var marker = new google.maps.Marker({
                    position: {
                        lat: punto.latitud,
                        lng: punto.longitud
                    },
                    map: map,
                    icon: image,
                    title: punto.nombre,
                    zIndex: 999
                });
                marker.addListener('click', function() {
                    // infowindow.open(marker.get('map'), marker);
                    var nombre = $filter('seo')($scope.reto.nombre);
                    var localizacion = $filter('seo')(this.title);
                    //$location.path('/reto-localizacion/' + nombre + '/' + localizacion);
                    alert('/reto-localizacion/' + nombre + '/' + localizacion);
                });
            }
        }

$scope.listaLocalizaciones = [];
        function cargarMapa() {
            console.log('cargamos mapa...');
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 39.397,
                    lng: -3.644
                },
                zoom: 5
            });

             Localizacion.LocalizacionReto.getById({
                id: 3
            }, function(localizaciones) {
                $scope.listaLocalizaciones = localizaciones;
                console.log(JSON.stringify(localizaciones, null, 4));
                setMarkers(map);
            });
            
        }

        getListaRetos();

    });