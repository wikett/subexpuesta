'use strict';

angular.module('subexpuestaV2App')
  .controller('LocalizacionesCtrl', function ($scope, $rootScope, $http, $upload, $log, $location, Localizacion, uiGmapGoogleMapApi, Auth) {
    
    $scope.getCurrentUser = Auth.getCurrentUser();
    

    $scope.localizacion = {};
    $scope.localizacionCreada = false;
    $scope.files = {};
    $scope.finalizado = false;
    $scope.mensajeError = "";

  $scope.rate = 0;
  $scope.rateCL = 0;
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

  $scope.tags = [];


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
           $scope.marker.icon = 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png';
 		});
        	
         	 //$log.log('longitud: '+marker.getPosition().lng());
        }
    }

    };

  $scope.marker = {
      id: 0,
      icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
      coords: {
        latitude: 0,
        longitude: 0
      },
      options: { draggable: true },
      events: {
        dragend: function (marker, eventName, args) {
          //$log.log('marker dragend');
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
          
        }
       
      }
    };

   uiGmapGoogleMapApi.then(function(maps) {

    });
	

$scope.crearLocalizacion = function(){
$log.debug();
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
		if(_.isUndefined($scope.localizacion.cloudinaryId))
		{
			$scope.mensajeError = "Por favor, seleccione la imagene que quiere subir.";			
			return;
		}
		if(_.isUndefined($scope.localizacion.acceso))
		{
			$scope.mensajeError = "Por favor, indique el acceso a la localizacion para realizar la fotografia.";			
			return;
		}
		if($scope.rate===0)
		{
			$scope.mensajeError = "Por favor, valore peligrosidad de la zona de acceso al lugar de la fotografia.";			
			return;
		}
		if($scope.rateCL===0)
		{
			$scope.mensajeError = "Por favor, valore la contaminacion luminica del lugar de la fotografia.";			
			return;
		}
		else{
    	
        $scope.nuevaLocalizacion = new Localizacion.LocalizacionAPI();
        $scope.nuevaLocalizacion.titulo = $scope.localizacion.titulo;
        

        $scope.listaEtiquetas = [];
        //$log.debug('tags: '+JSON.stringify($scope.tags));
        if($scope.tags.length>0)
        _.each($scope.tags,function(etiqueta){
          //$log.debug('etiqueta: '+etiqueta.text);
          $scope.listaEtiquetas.push(etiqueta.text);
        })

        
        $scope.nuevaLocalizacion.tags = $scope.listaEtiquetas;
        $scope.nuevaLocalizacion.autor = $scope.getCurrentUser.username;
        $scope.nuevaLocalizacion.cloudinaryId = $scope.localizacion.cloudinaryId;
        $scope.nuevaLocalizacion.fechaToma = $scope.dt;
        $scope.nuevaLocalizacion.acceso = $scope.localizacion.acceso;
        $scope.nuevaLocalizacion.peligrosidad = $scope.rate;
        $scope.nuevaLocalizacion.contaminacionLuminica = $scope.rateCL;
        $scope.nuevaLocalizacion.notasAdicionales = $scope.localizacion.notasAdicionales;
        $scope.nuevaLocalizacion.latitud = $scope.marker.coords.latitude;
        $scope.nuevaLocalizacion.longitud = $scope.marker.coords.longitude;

        //$log.debug('$scope.nuevaLocalizacion: '+JSON.stringify($scope.nuevaLocalizacion));

       $scope.nuevaLocalizacion.$save().then(function(response){
        	$scope.localizacionCreada = true;
        });

       }
    };


    $scope.updateTitle = function(){
      var uploadParams = $scope.widget.fileupload('option', 'formData');
      uploadParams["context"] = "photo=" + $scope.title;
      $scope.widget.fileupload('option', 'formData', uploadParams);
    };

    $scope.widget = $(".cloudinary_fileupload")
      .unsigned_cloudinary_upload($.cloudinary.config().upload_preset, {tags: 'subexpuesta', context:'photo='}, {
        // Uncomment the following lines to enable client side image resizing and valiation.
        // Make sure cloudinary/processing is included the js file
        //disableImageResize: false,
        //imageMaxWidth: 800,
        //imageMaxHeight: 600,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
        maxFileSize: 5000000, // 5MB
        dropZone: "#direct_upload_jquery",
        start: function (e) {
          $scope.status = "Comienza la carga...";
          $scope.files = {};
          $scope.$apply();
        },
        fail: function (e, data) {
          $scope.status = "Error en la carga";
          $scope.$apply();
        }
      })
      .on("cloudinaryprogress", function (e, data) {
        var name = data.files[0].name;
        var file = $scope.files[name] || {};
        file.progress = Math.round((data.loaded * 100.0) / data.total);
        file.status = "Subiendo... " + file.progress + "%";
        $scope.files[name] = file;
        $scope.$apply();
        })
      .on("cloudinaryprogressall", function (e, data) {
        $scope.progress = Math.round((data.loaded * 100.0) / data.total);
        $scope.status = "Subiendo... " + $scope.progress + "%";
        $scope.$apply();
      })
      .on("cloudinarydone", function (e, data) {
        data.result.context = {custom: {photo: $scope.title}};
        $scope.status = "Finalizado correctamente";
        $scope.result = data.result;
        $scope.localizacion.cloudinaryId = $scope.result.public_id;
        var name = data.files[0].name;
        var file = $scope.files[name] ||{};
        file.name = name;
        file.result = data.result;
        $scope.files[name] = file;
        $scope.finalizado = true;
        $scope.$apply();
      });



    });