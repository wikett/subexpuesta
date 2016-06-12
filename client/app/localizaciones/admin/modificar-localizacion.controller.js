'use strict';

angular.module('subexpuestaV2App')
    .controller('AdminLocalizacionCtrl', function($scope, $rootScope, Localizacion, Auth, $log, $http) {

        $scope.isAdmin = Auth.isAdmin;

        $scope.listaLocalizaciones = {};
        $scope.descripcionMejora = '';

        $scope.mejoraCreada = false;
        $scope.nuevoEstado = 2;

        $scope.items = [{
            id: 0,
            name: 'Aceptada'
        }, {
            id: 1,
            name: 'Pendiente de Validar'
        }, {
            id: 2,
            name: 'Rechazada'
        }];

        $scope.actualizarDirecciones = function() {
            console.log('Actualizando...');
            Localizacion.LocalizacionAPI.query(function(data){
                for (var i = 0; i < data.length; i++) {
                    //console.log(data[i]._id);
                    obtenerDirecciones(data[i]._id);
                }

            
            var contactCounter = 0;
            (function addDot() {
              setTimeout(function() {
                if (contactCounter < data.length) {
                  //$('#dots').append('.');
                  console.log(contactCounter+'/'+data.length+' Actualizando ('+data[contactCounter].titulo+') ...');

                  //////////////////////////////////////////////
                if(data[contactCounter].direccion==="")
                    obtenerDirecciones(data[contactCounter]._id);
                    
                

                  ///////////////////////////////////////////////
                  contactCounter++;
                  addDot();
                }
                else
                {
                    console.log("Actualizacion terminada")
                }
              }, 2000);
            })();


            });
        };

        function getListaLocalizciones() {
            $scope.listaLocalizaciones = Localizacion.LocalizacionAPI.query(function() {})
        };

        function obtenerDirecciones(idLocalizacion) {
            var geocoder = new google.maps.Geocoder;

            Localizacion.LocalizacionAPI.get({
                id: idLocalizacion
            }, function(data) {

                //console.log(data);
                var latlng = {lat: parseFloat(data.latitud), lng: parseFloat(data.longitud)};
                geocoder.geocode({'location': latlng}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        
                        var newLocalizacion = data;
                        newLocalizacion.direccion =results[1].formatted_address; 
                        //console.log(JSON.stringify(newLocalizacion, null, 4));
                        newLocalizacion.$update().then(function(response){
                            //console.log("Localizacion "+newLocalizacion.titulo+" actualizada correctamente");
                        })
                    }
                    else{
                     console.log('Direccion no encontrada');   
                    }
                });



            });

        };

        $scope.actualizarIndividual = function(idLoca){
            console.log('actualizarIndividual');
            obtenerDirecciones(idLoca);

        };

        $scope.actualizarLocalizacion = function(idLocalizacion, nuevoEstado) {

            $scope.actualizarLocalizacion = Localizacion.LocalizacionAPI.get({
                id: idLocalizacion
            }, function() {

                $scope.actualizarLocalizacion.estado = nuevoEstado;

                $scope.actualizarLocalizacion.$update().then(function(response) {
                    getListaLocalizciones();
                });
            });
            //$log.debug('nuevo Estado: '+nuevoEstado);        
        };

        getListaLocalizciones();

    });