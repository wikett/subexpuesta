'use strict';

angular.module('subexpuestaV2App')
  .controller('LocalizacionesVistaCtrl', function ($scope, $rootScope, $log, Localizacion, $stateParams, uiGmapGoogleMapApi, Auth, Modal, $location) {
    
    


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

    $scope.delete = Modal.confirm.borrarLocalizacion(function(localizacion) {
      //$log.debug('Dentro modal: '+$stateParams.id);

      $scope.editarLocalizacion = Localizacion.LocalizacionAPI.get({id: $stateParams.id}, function(){
          $scope.editarLocalizacion.estado = 5;

          $scope.editarLocalizacion.$update().then(function(response){
            //$log.debug('Localizacion borrada');
            $location.path('/tus-localizaciones/'+$scope.getCurrentUser.username);
          });
        });
      
      });
      
function getLocalizacion() {
           
            Localizacion.LocalizacionAPI.get({
                id: $stateParams.id
            }, function(localizacionData) {
                if(localizacionData.estado==2)
                {
                       $location.path('/');
                }
                else
                {
                $scope.localizacion = localizacionData;
                $scope.marker.coords.latitude = localizacionData.latitud;
                $scope.marker.coords.longitude = localizacionData.longitud;
                $scope.map.center.latitude = localizacionData.latitud;
                $scope.map.center.longitude = localizacionData.longitud;
                if($scope.getCurrentUser.username===localizacionData.autor)
                {
                  $scope.mostrarEditar = true;
                }

                // title & meta tags
                $rootScope.title = localizacionData.titulo + ' por: '+localizacionData.autor+ ' | subexpuesta.com';
                $rootScope.metaDescription = localizacionData.acceso;
                $rootScope.metaDescription = $rootScope.title;
                $rootScope.descriptionFB = $rootScope.metaDescription;
                $rootScope.imageFB = 'http://res.cloudinary.com/djhqderty/image/upload/v1429114149/'+localizacionData.cloudinaryId+'.jpg';
              }

            });


        };
      
      getLocalizacion();


    })