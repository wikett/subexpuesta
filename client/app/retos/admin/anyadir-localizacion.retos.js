'use strict';

angular.module('subexpuestaV2App')
    .controller('AnyadirLocalizacionRetosCtrl', function($scope, $rootScope, $log, uiGmapGoogleMapApi, Reto, Auth, $location, $stateParams, RetoLocalizacion) {
 $scope.selectedComunidad = '';
        $scope.comunidades = [{nombre: 'Cataluña', numero: 1}, {nombre: 'Comunidad Valenciana', numero: 2},{nombre: 'Murcia', numero: 3},{nombre: 'Andalucia', numero: 4}, {nombre: 'Galicia', numero: 5}, {nombre: 'Asturias', numero: 6}, {nombre: 'Cantabria', numero: 7}, {nombre: 'Pais Vasco', numero: 8},{nombre: 'Gran Canarias', numero: 9}, {nombre: 'Palma de Mallorca', numero: 10}, {nombre: 'Ceuta', numero: 11},{nombre: 'Melilla', numero: 12}];

       
        if (!Auth.isAdmin()) {
            $location.path('/');
        }
        $scope.model = {
            id: 0
        };

var marker;
function placeMarker(location) {
    marker = new google.maps.Marker({
      position: location,
      map: map
    });
  
}
$scope.posicionLocalizacion = {};
function cargarMapa() {
            console.log('cargamos mapa...');
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 39.397,
                    lng: -3.644
                },
                zoom: 5
            });
};
function initMap() {
            var mapOptions = {
            zoom: 8, // The initial zoom level when your map loads (0-20)
            center: {
                    lat: 39.397,
                    lng: -3.644
                }

        }
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

map.addListener('click', function(e) {
   placeMarkerAndPanTo(e.latLng, map);
    //placeMarker(e.latLng);
  });
}

function placeMarkerAndPanTo(latLng, map) {
  marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  $scope.posicionLocalizacion.latitud = latLng.lat();
  $scope.posicionLocalizacion.longitud = latLng.lng();
  console.log($scope.posicionLocalizacion);
  //map.panTo(latLng);
}
google.maps.event.addListener(map, 'click', function(event) {
  placeMarker(event.latLng);
});


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

        



        function getReto() {

            Reto.get({
                id: $stateParams.id
            }, function(retoData) {
                initMap();
                $scope.reto = retoData;
                //$scope.marker.coords.latitude = eventoData.latitud;
                //$scope.marker.coords.longitude = eventoData.longitud;
                
                

            });


        };

        getReto();

        $scope.anyadirLocalizacion = function() {
            console.log('Comunidad: '+$scope.selectedComunidad);
            $scope.localizacionReto = {};
            $scope.localizacionReto.longitud =$scope.posicionLocalizacion.longitud;
            $scope.localizacionReto.latitud =  $scope.posicionLocalizacion.latitud;
            $scope.localizacionReto.nombre = $scope.nuevaLocalizacion.nombre;
            $scope.localizacionReto.descripcion = $scope.nuevaLocalizacion.descripcion;
            $scope.localizacionReto.codigoReto = $scope.nuevaLocalizacion.codigoReto;
            $scope.localizacionReto.comunidad=$scope.selectedComunidad;

            
            $scope.reto.localizaciones.push($scope.localizacionReto);
            
            RetoLocalizacion.update({id: $scope.reto._id}, $scope.localizacionReto);
            
        };


    });