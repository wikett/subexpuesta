'use strict';

angular.module('subexpuestaV2App')
    .controller('LocalizacionesCtrl', function($scope, $rootScope, $http, $log, $location, Localizacion, uiGmapGoogleMapApi, Auth, Modal, $filter, Usuario, User, UsuarioAviso, Reto, Email, RetoUpdateLocalizacion) {

        $scope.getCurrentUser = Auth.getCurrentUser();

        $rootScope.title = 'Localizaciones Fotografía Nocturna';
        $rootScope.metaDescription = 'Mapa de todo el mundo con las mejores localizaciones de fotografía nocturna que te puedas encontrar!';
        $rootScope.titleFB = 'Localizaciones Fotografía Nocturna';
        $rootScope.descriptionFB = 'Mapa de todo el mundo con las mejores localizaciones de fotografía nocturna que te puedas encontrar!';
        $rootScope.imageFB = 'http://www.subexpuesta.com/assets/images/subexpuesta-logo.png';

        $scope.localizacion = {};
        $scope.localizacionCreada = false;
        $scope.files = {};
        $scope.finalizado = false;
        $scope.mensajeError = "";

        $scope.rate = 0;
        $scope.rateCL = 0;
        $scope.max = 10;
        $scope.isReadonly = false;
        $scope.showMap = false;
        var geocoder = new google.maps.Geocoder;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };
        $scope.hoveringOverCL = function(value) {
            $scope.overStarCL = value;
            $scope.percentCL = 100 * (value / $scope.max);
        };



        $scope.ratingStates = [{
            stateOn: 'glyphicon-ok-sign',
            stateOff: 'glyphicon-ok-circle'
        }, {
            stateOn: 'glyphicon-star',
            stateOff: 'glyphicon-star-empty'
        }, {
            stateOn: 'glyphicon-heart',
            stateOff: 'glyphicon-ban-circle'
        }, {
            stateOn: 'glyphicon-heart'
        }, {
            stateOff: 'glyphicon-off'
        }];

        $scope.today = function() {
            $scope.dt = new Date();
        };

        //$scope.today();

        $scope.clear = function() {
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




         $scope.defaultBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(44.399995, 4.087896),
                    new google.maps.LatLng(40.66541, -4.31715));
        $scope.map = {
            center: {
                latitude: 40.399995,
                longitude: -4.087896
            },

            zoom: 6,
            events: {
                click: function(map, eventName, handlerArgs) {

                    $scope.$apply(function() {
                        $scope.marker.coords.latitude = handlerArgs[0].latLng.lat();
                        $scope.marker.coords.longitude = handlerArgs[0].latLng.lng();
                        $scope.marker.icon = 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png';
                    });
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
            options: {
                draggable: true
            },
            events: {
                dragend: function(marker, eventName, args) {
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                }
            }
        };


        uiGmapGoogleMapApi.then(function(maps) {
            setTimeout(function() {
                $scope.showMap = true;
                $scope.$apply();
            }, 100);
        });

        $scope.sliderChange = function() {
            //console.log("slider value changed : ");
            //$scope.map.circle
            if (!_.isNull($scope.place))
                if ($scope.place !== undefined && !_.isUndefined($scope.place.geometry.location)) {
                    // $scope.map.circle.radius = $scope.sliderValue * 1000;
                    console.log(JSON.stringify($scope.place.geometry.location));

                    if (!_.isUndefined($scope.place.geometry.location.lat())) {
                        $scope.marker.coords.latitude = $scope.place.geometry.location.lat();
                        $scope.marker.coords.longitude = $scope.place.geometry.location.lng();
                        $scope.map.center.latitude = $scope.place.geometry.location.lat();
                        $scope.map.center.longitude = $scope.place.geometry.location.lng();
                        $scope.map.zoom = 14;
                    }
                }
        };

        $scope.$watch('place', function() {
            $scope.sliderChange();
        });

        $scope.listaRetos = [];
        $scope.listaLocalizaciones = [];
        $scope.codigoRetoSeleccionado = "";
         $scope.mostrarLocalizaciones = false; 
         $scope.retoSeleccionado = {};

        $scope.selectedItem = 0;
        function getRetos(){
            $scope.listaRetos = Reto.query(function(){
            })
        };

       getRetos();

       $(".dropdown-menu li a").click(function(){

          var selText = $(this).text();
          console.log(selText);
          //$(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
        });

       $scope.retoSeleccionado = "";
       $scope.$watch('retoSelected', function(newVal) {
            if (newVal){
                $scope.retoFaroSeleccionado = newVal;
                $scope.retoSeleccionado = newVal.nombre;
              $scope.listaLocalizaciones = newVal.localizaciones;
              //var listaAgrupada = _.groupBy($scope.listaLocalizaciones, 'comunidad');
                var listaAgrupada=_.chain($scope.listaLocalizaciones)
                .groupBy('comunidad')
                .map(function(value, key) {
                    return {
                        comunidad: key,
                        localizacion: value
                    }
                })
                .value();
              
              $scope.otraLista = _.filter(listaAgrupada, function(item){
                return item.comunidad == 1;
              });
              $scope.otraLista2 = _.filter(listaAgrupada, function(item){
                return item.comunidad == 2;
              });
              $scope.otraListaMurcia = _.filter(listaAgrupada, function(item){
                return item.comunidad == 3;
              });
              $scope.otraListaAndalucia = _.filter(listaAgrupada, function(item){
                return item.comunidad == 4;
              });
              $scope.otraListaGalicia = _.filter(listaAgrupada, function(item){
                return item.comunidad == 5;
              });
              $scope.otraListaAsturias = _.filter(listaAgrupada, function(item){
                return item.comunidad == 6;
              });
              $scope.otraListaCantabria = _.filter(listaAgrupada, function(item){
                return item.comunidad == 7;
              });
              $scope.otraListaPaisVasco = _.filter(listaAgrupada, function(item){
                return item.comunidad == 8;
              });
              $scope.otraListaCanarias = _.filter(listaAgrupada, function(item){
                return item.comunidad == 9;
              });
              $scope.otraListaIslasBaleares = _.filter(listaAgrupada, function(item){
                return item.comunidad == 10;
              });
              $scope.otraListaCeuta = _.filter(listaAgrupada, function(item){
                return item.comunidad == 11;
              });
              $scope.otraListaMelilla = _.filter(listaAgrupada, function(item){
                return item.comunidad == 12;
              });
              //console.log(JSON.stringify($scope.otraLista));
              $scope.mostrarLocalizaciones = true;  
            }
            else{
                console.log('Selecciona reto');
                $scope.mostrarLocalizaciones = false; 
                $scope.codigoRetoSeleccionado = "";
            }
        });


       $scope.$watch('localizacionSelected', function(newVal) {
            if (newVal){
              console.log(newVal);              
              $scope.codigoRetoSeleccionado = newVal;  
            } 
            else{
              $scope.codigoRetoSeleccionado = "";  
            }
        });


        $scope.crearLocalizacion = function() {

            if ($scope.marker.coords.latitude === 0) {
                $scope.mensajeError = "Por favor, indique la localización de la fotografía en el mapa.";
                return;
            }
            if (_.isUndefined($scope.localizacion.titulo)) {
                $scope.mensajeError = "Por favor, indique el titulo de la fotografia.";
                return;
            }
            if (_.isUndefined($scope.dt)) {
                $scope.mensajeError = "Por favor, indique la fecha de cuando fue tomada la fotografia.";
                return;
            }
            if (_.isUndefined($scope.localizacion.cloudinaryId)) {
                $scope.mensajeError = "Por favor, seleccione la imagene que quiere subir.";
                return;
            }
            if (_.isUndefined($scope.localizacion.acceso)) {
                $scope.mensajeError = "Por favor, indique el acceso a la localizacion para realizar la fotografia.";
                return;
            }
            if ($scope.rate === 0) {
                $scope.mensajeError = "Por favor, valore peligrosidad de la zona de acceso al lugar de la fotografia.";
                return;
            }

            if (_.isUndefined($scope.localizacion.categoria)) {
                $scope.mensajeError = "Por favor, indique la categoria de la fotografia.";
                return;
            }
            if ($scope.localizacion.categoria < 8)
                if ($scope.rateCL === 0) {
                    $scope.mensajeError = "Por favor, valore la contaminacion luminica del lugar de la fotografia.";
                    return;
                } else {

                    $scope.nuevaLocalizacion = new Localizacion.LocalizacionAPI();
                    $scope.nuevaLocalizacion.titulo = $scope.localizacion.titulo;


                    $scope.listaEtiquetas = [];
                    //$log.debug('tags: '+JSON.stringify($scope.tags));
                    if ($scope.tags.length > 0)
                        _.each($scope.tags, function(etiqueta) {
                            //$log.debug('etiqueta: '+etiqueta.text);
                            $scope.listaEtiquetas.push(etiqueta.text);
                        })

                    //$log.debug('$scope.rateCL: ' + $scope.rateCL);
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
                    $scope.nuevaLocalizacion.categoria = $scope.localizacion.categoria;
                    $scope.nuevaLocalizacion.codigoReto = $scope.codigoRetoSeleccionado;
                    $scope.nuevaLocalizacion.nombreReto = $scope.retoSeleccionado;
                    

                    var latlng = {lat: parseFloat($scope.nuevaLocalizacion.latitud), lng: parseFloat($scope.nuevaLocalizacion.longitud)};
                      geocoder.geocode({'location': latlng}, function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                          if (results[1]) {
                            //console.log('Geocoder: '+JSON.stringify(results[1].formatted_address));
                            $scope.nuevaLocalizacion.direccion = results[1].formatted_address;
                          } else {
                            console.log('No results found');
                          }
                        } else {
                          console.log('Geocoder failed due to: ' + status);
                        }
                        $scope.nuevaLocalizacion.$save().then(function(response) {
                                $scope.localizacionCreada = true;
                                //Agregar aviso
                                User.query({}, function(usuarios) {
                                    _.each(usuarios, function(usuario) {
                                        //$log.debug('usuario.username: ' + usuario.username + ' $scope.getCurrentUser.username: ' + $scope.getCurrentUser.username);
                                        if (usuario.radioAviso > 0 && usuario.username != $scope.getCurrentUser.username) {
                                            var loc1 = new google.maps.LatLng($scope.marker.coords.latitude, $scope.marker.coords.longitude);
                                            var loc2 = new google.maps.LatLng(usuario.coordenadasAvisoLatitud, usuario.coordenadasAvisoLongitud);
                                            var distaciaKM = Math.round(google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2) / 1000);
                                            var nuevoAviso = {
                                                titulo: $scope.localizacion.titulo,
                                                autor: $scope.getCurrentUser.username,
                                                distanciakm: distaciaKM,
                                                imagen: 'http://res.cloudinary.com/djhqderty/image/upload/c_fit,w_340/v1/' + $scope.localizacion.cloudinaryId + '.jpg',
                                                url: 'http://www.subexpuesta.com/localizaciones/' + response._id + '/' + $filter('seo')(response.titulo)
                                            }
                                            if (distaciaKM < usuario.radioAviso) {
                                                UsuarioAviso.update({
                                                    id: usuario._id
                                                }, nuevoAviso);

                                            }
                                        }
                                    });
                                });

                                //Actualizar reto
                                if($scope.nuevaLocalizacion.codigoReto!=="")
                                {
                                    console.log('Editamos localizacion del reto');
                                   /* var objetoUpadte = _.filter($scope.retoFaroSeleccionado.localizaciones, function(item){
                                      return item.codigoReto == $scope.codigoRetoSeleccionado;
                                   });
                                   //console.log('objetoUpadte: '+JSON.stringify(objetoUpadte[0]._id));
                                    var objetoLocalizacion = {};
                                    objetoLocalizacion.codigoReto = $scope.codigoRetoSeleccionado;

                                    RetoUpdateLocalizacion.update({id: objetoUpadte[0]._id}, objetoLocalizacion);*/


                                    
                                    Email.EmailEnviarContacto.enviarMailContacto({
                                    direccion: 'enrique.ac9@gmail.com',
                                    nombre: 'Quique',
                                    asunto: 'Reto Subexpuesta.com',
                                    mensaje: 'Fotografia subida para el reto'+$scope.codigoRetoSeleccionado
                                    },function(mensaje) {
                                        $log.debug('mensaje: '+JSON.stringify(mensaje));                                    
                                    });
                                }
                                $location.path('/localizacion-creada/' + response._id + '/' + $filter('seo')(response.titulo));
                            });//save localizacion
                        
                      });                       
                }
        };

        $scope.modalCreada = Modal.confirm.localizacionCreada(function(response) {
            //$log.debug('Dentro modal: ');
            $location.path('/localizacion-creada');
        });

        $scope.updateTitle = function() {
            var uploadParams = $scope.widget.fileupload('option', 'formData');
            uploadParams["context"] = "photo=" + $scope.title;
            $scope.widget.fileupload('option', 'formData', uploadParams);
        };

        $scope.widget = $(".cloudinary_fileupload")
            .unsigned_cloudinary_upload($.cloudinary.config().upload_preset, {
                tags: 'subexpuesta',
                context: 'photo=',
                folder: 'subexpuesta'
            }, {
                // Uncomment the following lines to enable client side image resizing and valiation.
                // Make sure cloudinary/processing is included the js file
                //disableImageResize: false,
                //imageMaxWidth: 800,
                //imageMaxHeight: 600,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
                maxFileSize: 5000000, // 5MB
                dropZone: "#direct_upload_jquery",
                start: function(e) {
                    $scope.status = "Comienza la carga...";
                    $scope.files = {};
                    $scope.$apply();
                },
                fail: function(e, data) {
                    $scope.status = "Error en la carga";
                    $scope.$apply();
                }
            })
            .on("cloudinaryprogress", function(e, data) {
                var name = data.files[0].name;
                var file = $scope.files[name] || {};
                file.progress = Math.round((data.loaded * 100.0) / data.total);
                file.status = "Subiendo... " + file.progress + "%";
                $scope.files[name] = file;
                $scope.$apply();
            })
            .on("cloudinaryprogressall", function(e, data) {
                $scope.progress = Math.round((data.loaded * 100.0) / data.total);
                $scope.status = "Subiendo... " + $scope.progress + "%";
                $scope.$apply();
            })
            .on("cloudinarydone", function(e, data) {
                data.result.context = {
                    custom: {
                        photo: $scope.title
                    }
                };
                $scope.status = "Finalizado correctamente";
                //console.log('data: '+JSON.stringify(data.result, null, 4));
                $scope.result = data.result;
                $scope.localizacion.cloudinaryId = $scope.result.public_id;
                var name = data.files[0].name;
                var file = $scope.files[name] || {};
                file.name = name;
                file.result = data.result;
                $scope.files[name] = file;
                $scope.finalizado = true;
                $scope.$apply();
            });



    });

angular.module('subexpuestaV2App').controller('ModalInstanceCtrl', function($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function() {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});