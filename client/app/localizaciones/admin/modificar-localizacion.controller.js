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


        function getListaLocalizciones() {
            $scope.listaLocalizaciones = Localizacion.LocalizacionAPI.query(function() {})
        };

        $scope.obtenerDirecciones = function(idLocalizacion) {

            $scope.actualizarLocalizacion = Localizacion.LocalizacionAPI.get({
                id: idLocalizacion
            }, function() {

                $http({
                    method: 'GET',
                    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.actualizarLocalizacion.latitud + ',' + $scope.actualizarLocalizacion.longitud,
                    transformRequest: function(data, headersGetter) {
                        var headers = headersGetter();
                        delete headers['Authorization'];
                        return headers;
                    }
                })
                    .success(function(response) {
                        //$log.debug('response: ' + JSON.stringify(response.results[0].formatted_address));
                        
                        $scope.actualizarLocalizacion.direccion = response.results[0].formatted_address;

                        $scope.actualizarLocalizacion.$update().then(function(response) {
                            getListaLocalizciones();
                        });
                    })


            });





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