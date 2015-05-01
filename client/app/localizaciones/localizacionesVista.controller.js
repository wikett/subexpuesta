'use strict';

angular.module('subexpuestaV2App')
  .controller('LocalizacionesVistaCtrl', function ($scope, $log, Localizacion, $stateParams, uiGmapGoogleMapApi, Auth) {
    
    $scope.localizacion = {};
     $scope.getCurrentUser = Auth.getCurrentUser();
     $scope.mostrarEditar = false;

  $scope.map = { 
    center: { 
      latitude: 0,
      longitude: 0
   },
    zoom: 5  

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

    });
      
function getLocalizacion() {
           
            Localizacion.LocalizacionAPI.get({
                id: $stateParams.id
            }, function(localizacionData) {
                $scope.localizacion = localizacionData;
                $scope.marker.coords.latitude = localizacionData.latitud;
                $scope.marker.coords.longitude = localizacionData.longitud;
                $scope.map.center.latitude = localizacionData.latitud;
                $scope.map.center.longitude = localizacionData.longitud;
                //$log.debug('$scope.getCurrentUser.username: '+$scope.getCurrentUser.username);
                //$log.debug('localizacionData.autor: '+localizacionData.autor);
                if($scope.getCurrentUser.username===localizacionData.autor)
                {
                  $scope.mostrarEditar = true;
                }
            });


        };
      
      getLocalizacion();


    })