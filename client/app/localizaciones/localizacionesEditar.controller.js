'use strict';

angular.module('subexpuestaV2App')
  .controller('LocalizacionesEditarCtrl', function ($scope, $stateParams, $log, $location, Localizacion, uiGmapGoogleMapApi, Auth, Modal) {
    
    $scope.getCurrentUser = Auth.getCurrentUser();
    

    $scope.localizacion = {};
    $scope.localizacionEditada = false;
    $scope.mensajeError = "";
    $scope.localizacionBorrada = false;

  $scope.rate = 5;
  $scope.rateCL = 5;
  $scope.max = 10;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };
  $scope.hoveringOverCL = function(value) {
    $scope.overStarCL = value;
    $scope.percentCL = 100 * (value / $scope.max);
  };

$scope.tags = [];

  $scope.ratingStates = [
    {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
    {stateOn: 'glyphicon-heart'},
    {stateOff: 'glyphicon-off'}
  ];

  $scope.today = function() {
    $scope.dt = new Date();
  };

  //$scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };



  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

    $scope.closeAlert = function() {
 		$scope.mensajeError = "";
    };

  $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[3];

  $scope.map = { 
  	center: { 
  		latitude: 40.399995,
  		longitude: -4.087896
   },
    zoom: 6,
    events:{
 	click: function (map, eventName, handlerArgs){

 		$scope.$apply(function() {
 			 $log.log('click event');
        	 $log.log('latitud: '+handlerArgs[0].latLng.lat());
        	 $log.log('$scope.marker.coords.latitude: '+$scope.marker.coords.latitude);
        	 $scope.marker.coords.latitude = handlerArgs[0].latLng.lat();
 			 $scope.marker.coords.longitude = handlerArgs[0].latLng.lng();
 		});
        	
         	 //$log.log('longitud: '+marker.getPosition().lng());
        }
    }

    };

  $scope.marker = {
      id: 0,
      coords: {
        latitude: 0,
        longitude: 0
      },
      icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
      options: { draggable: true },
      events: {
        dragend: function (marker, eventName, args) {
          $log.log('marker dragend');
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
          
        }
       
      }
    };

   uiGmapGoogleMapApi.then(function(maps) {

    });
	




$scope.editarLocalizacion = function(){
		if($scope.marker.coords.latitude===0)
		{
			$scope.mensajeError = "Por favor, indique la localización de la fotografía en el mapa.";
			return;	
		}		
		if(_.isUndefined($scope.localizacion.titulo))
		{
			$scope.mensajeError = "Por favor, indique el titulo de la fotografia.";			
			return;
		}
		if(_.isUndefined($scope.dt))
		{
			$scope.mensajeError = "Por favor, indique la fecha de cuando fue tomada la fotografia.";			
			return;
		}
		if(_.isUndefined($scope.localizacion.acceso))
		{
			$scope.mensajeError = "Por favor, indique el acceso a la localizacion para realizar la fotografia.";			
			return;
		}
    if($scope.rate===0)
    {
      $scope.mensajeError = "Por favor, valore la facilidad de acceso al lugar de la fotografia.";      
      return;
    }
    if($scope.rateCL===0)
    {
      $scope.mensajeError = "Por favor, valore la contaminacion luminica del lugar de la fotografia.";      
      return;
    }
		else{

            	

        $scope.editarLocalizacion = Localizacion.LocalizacionAPI.get({id: $stateParams.id}, function(){
          $scope.editarLocalizacion.titulo = $scope.localizacion.titulo;
          $scope.editarLocalizacion.autor = $scope.getCurrentUser.username;
          $scope.editarLocalizacion.cloudinaryId = $scope.localizacion.cloudinaryId;
          $scope.editarLocalizacion.fechaToma = $scope.dt;
          $scope.editarLocalizacion.acceso = $scope.localizacion.acceso;
          $scope.editarLocalizacion.peligrosidad = $scope.rate;
          $scope.editarLocalizacion.contaminacionLuminica = $scope.rateCL;
          $scope.editarLocalizacion.notasAdicionales = $scope.localizacion.notasAdicionales;
          $scope.editarLocalizacion.latitud = $scope.marker.coords.latitude;
          $scope.editarLocalizacion.longitud = $scope.marker.coords.longitude;

          $scope.editarLocalizacion.$update().then(function(response){
            $scope.localizacionEditada = true;
          })
        })

       }
    };


  

    function getLocalizacion() {
           
            Localizacion.LocalizacionAPI.get({
                id: $stateParams.id
            }, function(localizacionData) {
                $scope.localizacion = localizacionData;
                $scope.marker.coords.latitude = localizacionData.latitud;
                $scope.marker.coords.longitude = localizacionData.longitud;
                $scope.map.center.latitude = localizacionData.latitud;
                $scope.map.center.longitude = localizacionData.longitud;
                $scope.dt = localizacionData.fechaToma;

                var listaTags = [];
                if(localizacionData.tags.length>0)
                _.each(localizacionData.tags,function(etiqueta){
                  var newTag = new function(){
                    this.text = etiqueta;
                  }
                  listaTags.push(newTag);                  
                })
              $scope.tags = listaTags;
                
            });


        };
      
      getLocalizacion();


    });