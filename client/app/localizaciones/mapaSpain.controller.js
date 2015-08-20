'use strict';

angular.module('subexpuestaV2App')
    .controller('MapaSpainCtrl', function($scope, $rootScope, $log, Localizacion, $stateParams, uiGmapGoogleMapApi, Auth) {

        $scope.showMap = false;
        $scope.getCurrentUser = Auth.getCurrentUser();
        $scope.listaLocalizaciones = {};

        $scope.provincias = [{nombre: 'a coruna', localizaciones: 0, texto:['a coruna','a coruña', 'la coruña']},{nombre: 'alava', localizaciones: 0, texto:'alava álava'}, {nombre: 'albacete', localizaciones: 0},{nombre: 'alicante', localizaciones: 0},{nombre: 'almeria', localizaciones: 0, texto:'alemría almeria'},{nombre: 'asturias', localizaciones: 0},{nombre: 'avila', localizaciones: 0, texto:'ávila avila'},{nombre: 'badajoz', localizaciones: 0},{nombre: 'baleares', localizaciones: 0},{nombre: 'barcelona', localizaciones: 0},{nombre: 'burgos', localizaciones: 0},{nombre: 'caceres', localizaciones: 0, texto:'caceres cáceres'},{nombre: 'cadiz', localizaciones: 0, texto:'cádiz cadiz'},{nombre: 'cantabria', localizaciones: 0},{nombre: 'castellon', localizaciones: 0, texto:'castellon castellón castelló'},{nombre: 'ceuta', localizaciones: 0},{nombre: 'ciudad real', localizaciones: 0},{nombre: 'cordoba', localizaciones: 0, texto:'cordoba córdoba'},{nombre: 'cuenca', localizaciones: 0},{nombre: 'girona', localizaciones: 0},{nombre: 'granada', localizaciones: 0},{nombre: 'guadalajara', localizaciones: 0},{nombre: 'guipuzcoa', localizaciones: 0},{nombre: 'huelva', localizaciones: 0},{nombre: 'huesca', localizaciones: 0},{nombre: 'jaen', localizaciones: 0},{nombre: 'la rioja', localizaciones: 0},{nombre: 'las palmas', localizaciones: 0},{nombre: 'leon', localizaciones: 0, texto:'leon león'},{nombre: 'lleida', localizaciones: 0, texto:'lleida lerida'},{nombre: 'lugo', localizaciones: 0},{nombre: 'madrid', localizaciones: 0},{nombre: 'malaga', localizaciones: 0, texto:'malaga málaga'},{nombre: 'melilla', localizaciones: 0},{nombre: 'murcia', localizaciones: 0},{nombre: 'navarra', localizaciones: 0},{nombre: 'ourense', localizaciones: 0, texto:'ourense orense'},{nombre: 'palencia', localizaciones: 0},{nombre: 'salamanca', localizaciones: 0},{nombre: 'tenerife', localizaciones: 0},{nombre: 'segovia', localizaciones: 0},{nombre: 'sevilla', localizaciones: 0},{nombre: 'soria', localizaciones: 0},{nombre: 'tarragona', localizaciones: 0},{nombre: 'teruel', localizaciones: 0},{nombre: 'toledo', localizaciones: 0},{nombre: 'valencia', localizaciones: 0},{nombre: 'valladolid', localizaciones: 0},{nombre: 'vizcaya', localizaciones: 0},{nombre: 'zamora', localizaciones: 0},{nombre: 'zaragoza', localizaciones: 0}];



    function MockHeatLayer(heatLayer) {
    // Adding 500 Data Points
    var map, pointarray, heatmap;
    var coordenadas = [];

            $scope.listaLocalizaciones = Localizacion.LocalizacionAPI.query();
            $scope.listaLocalizaciones.$promise.then(function (result){
                //$scope.listaLocalizaciones = result;
                _.each(result, function(loca) {
                    $log.debug('Loca: '+loca.latitud+', '+loca.longitud);
                    if(!_.isUndefined(loca.direccion)){
                        for(var i=0;i<$scope.provincias.length;i++){
                            if(!_.isUndefined($scope.provincias[i].texto))
                            {
                                for(var j=0;j<$scope.provincias[i].texto.length;j++)
                                {
                                    if(loca.direccion.indexOf($scope.provincias[i].texto[j])>-1)
                                    {
                                        $scope.provincias[i].localizaciones++;
                                    }
                                }
                            }
                            /*else{

                            }*/
                        }
                    }
                    coordenadas.push(new google.maps.LatLng(loca.latitud, loca.longitud));

                });
                
            })

    var pointArray = new google.maps.MVCArray(coordenadas);
    heatLayer.setData(pointArray);
    };



        $scope.map = {
            center: {
              latitude: 40.399995,
              longitude: -4.087896
            },
            zoom: 4,
            heatLayerCallback: function (layer) {
                //set the heat layers backend data
                var mockHeatLayer = new MockHeatLayer(layer);
                },
            showHeat: true
        };

        /*$scope.kmlLayerOptions1 = {
      url: "http://res.cloudinary.com/djhqderty/raw/upload/v1439549152/provincias_flw9jr.kml"
     
      
    };*/

    

        $scope.marker = {
            id: 0,
            icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
            coords: {
                latitude: 0,
                longitude: 0
            }
        };

        uiGmapGoogleMapApi.then(function(maps) {
            setTimeout(function() {
                $scope.showMap = true;
                $scope.$apply();
            }, 100);
        });


            function getListaLocalizciones(){

    };

    getListaLocalizciones();



    })