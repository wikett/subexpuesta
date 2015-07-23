'use strict';

angular.module('subexpuestaV2App')
  .controller('LocalizacionesMapaCtrl', function ($scope, $rootScope, $log, Localizacion, uiGmapGoogleMapApi) {
    

    
    $rootScope.title = 'Mapa con Localizaciones de Fotografias Nocturnas | subexpuesta.com';
    $rootScope.titleFB = 'Mapa con Localizaciones de Fotografias Nocturnas | subexpuesta.com';
    $rootScope.metaDescription = 'Descubre localizaciones de fotografias nocturnas cerca de tu zona, o de un nuevo sitio para poder hacer tu version. Juega con el mapa y explora.';
    $rootScope.descriptionFB = 'Descubre localizaciones de fotografias nocturnas cerca de tu zona, o de un nuevo sitio para poder hacer tu version. Juega con el mapa y explora.';
    //$log.debug('LocalizacionesMapaCtrl | title: '+$rootScope.title);
    
    $scope.busqueda = '';
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





  function getLocalizaciones(){
      $scope.listaLocalizaciones = Localizacion.LocalizacionAPI.query(function(){
        

        _.each($scope.listaLocalizaciones, function(loca){
          
          /*if(loca.tags.length>0)
          {
            
            _.each(loca.tags, function(etiqueta){
              $log.debug('etiqueta: '+etiqueta.text);
            })
          }
          $log.debug('etiqueta: '+loca.tags);*/
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
            icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
            events:{
              click: function (map, eventName, handlerArgs){

                $scope.$apply(function() {
                       //$log.log('click event');
                       //$log.log('click: '+JSON.stringify(handlerArgs));
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


                       //$log.log('$scope.marker.coords.latitude: '+$scope.marker.coords.latitude);
                     //  $scope.marker.coords.latitude = handlerArgs[0].latLng.lat();
                   //$scope.marker.coords.longitude = handlerArgs[0].latLng.lng();
                });
          }
    }

          };
          //ret[idKey] = loca.cloudinaryId;
           if(loca.estado!=2)
             $scope.misLocalizaciones.push(ret);
          });



      })
    };
getLocalizaciones();



    })