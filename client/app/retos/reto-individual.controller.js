'use strict';

angular.module('subexpuestaV2App')
    .controller('RetoIndividualCtrl', function($scope, $rootScope, $log, $stateParams, Reto, $filter, $location,Localizacion) {
        $scope.reto = {};
        $scope.porcentajeCompletado = 0;

          // fruits
  $scope.fruits = ['Cataluña', 'Comunidad Valenciana', 'Murcia', 'Andalucía', 'Galicia', 'Asturias', 'Cantabria', 'Pais Vasco', 'Canarias', 'Islas Baleares', 'Ceuta', 'Melilla'];

  // selected fruits
  $scope.selection = [];
  $scope.seleccionComunidad = [];
  $scope.comunidadSeleccionada = "";

  // toggle selection for a given fruit by name
  $scope.toggleSelection = function toggleSelection(fruitName) {
    var idx = $scope.selection.indexOf(fruitName);
   
    // is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }

    // is newly selected
    else {
      $scope.selection.push(fruitName);
    }
    if($scope.selection.length>0)
    {
        //console.log('selection: '+$scope.selection.indexOf('Cataluña'));  
         //console.log(fruitName);
         $scope.comunidadSeleccionada = fruitName;
         
    }
    else
    {
        $scope.comunidadSeleccionada = "";
    }
    getListaRetos($scope.selection); 
    
  };


        function getListaRetos(filtros) {
            Reto.query(function(data) {
                $scope.listaRetos = data;
                for (var i = 0; i < $scope.listaRetos.length; i++) {
                    var nombre = $filter('seo')(data[i].nombre);
                    if (nombre === $stateParams.nombre) {
                        $scope.reto = data[i];
                        // Aplicamos filtro comunidad
                        //console.log('reto: ' + JSON.stringify($scope.reto));
                        var localizacionesFiltradas = [];
                        if(filtros.length>0)
                        {
                            $scope.seleccionComunidad = [];
                            for (var i = 0; i < filtros.length; i++) {
                                //console.log('filtros[i]: '+filtros[i]);
                                $scope.seleccionComunidad.push($scope.fruits.indexOf(filtros[i])+1);
                                var indiceComunidad = $scope.seleccionComunidad[i] + 1;
                               



                               /* for (var j = 0; j < $scope.reto.localizaciones.length; j++) {
                                    console.log('$scope.reto.localizaciones[j].comunidad: '+$scope.reto.localizaciones[j].comunidad+'=== $scope.seleccionComunidad[i]: '+indiceComunidad);
                                    
                                    if($scope.reto.localizaciones[j].comunidad===indiceComunidad)
                                    {
                                        localizacionesFiltradas.push($scope.reto.localizaciones[i]);
                                        console.log('localizacionesFiltradas: '+JSON.stringify($scope.reto.localizaciones[i]));
                                    }
                                }
                                $scope.reto.localizaciones = localizacionesFiltradas;*/
                            }
                            $scope.reto.localizaciones= _.filter($scope.reto.localizaciones, function(dataL){
                        return _.contains($scope.seleccionComunidad, dataL['comunidad']);
                    });
                            

                            //$scope.reto = localizacionesFiltradas[0];
                            //console.log('asdfasfd: ' + JSON.stringify(asdfasfd));
                           // console.log('seleccionComunidad seleccionComunidad: ' + JSON.stringify($scope.seleccionComunidad));
                            //_.filter($scope.reto, function(item){ return _.contains($scope.seleccionComunidad, item[comunidad]);      
                            //console.log('reto despues: ' + JSON.stringify($scope.reto));
                        }
                       


                        

                if($scope.reto.localizaciones.length>0)
                {
                    $scope.totalLocalizaciones = $scope.reto.localizaciones.length;
                    var recibidas = _.filter($scope.reto.localizaciones, function(dataL){
                        return dataL.recibida===true;
                    });
                    recibidas = recibidas.length;
                    $scope.porcentajeCompletado = recibidas * 100 / $scope.reto.localizaciones.length; 
                }
                //console.log('porcentaje '+JSON.stringify( $scope.porcentajeCompletado)); 

                        cargarMapa();
                        //initMap();
                        return;
                    }
                }

            });

        };

        function initMap() {
  var myLatLng = {lat: -25.363, lng: 131.044};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });

  var myyLatLng = {lat: -26.363, lng: 133.044};
  var marker2 = new google.maps.Marker({
    position: myyLatLng,
    map: map,
    title: 'Hello World!'
  });
}

        function setMarkers(map) {
           
            
            var puntos = $scope.reto.localizaciones;
            for (var i = 0; i < puntos.length; i++) {
                var punto = puntos[i];
                var newLatLng = new google.maps.LatLng({lat: punto.latitud, lng: punto.longitud}); 
                console.log('recibida: '+punto.recibida);
                var image = {};
                if(punto.recibida)
                {
                    image.url = 'https://1.bp.blogspot.com/-H5OflLBXMU8/V3qfP1IuBlI/AAAAAAAAAMM/tpu9q95UI2AWMtVxnqQv8hf0vJJPMSUfACLcB/s1600/icono-mapa-verde.png';
                    image.size = new google.maps.Size(32, 32);
                }
                else
                {
                     image.url = 'https://1.bp.blogspot.com/-m3XRGrHTuWo/V3qfPzWM0MI/AAAAAAAAAMQ/wmel7GKLMGA37eXxUCvntyguZrA8EmaoACLcB/s1600/icono-mapa_xnqyqd.png';
                    image.size = new google.maps.Size(32, 32);   
                }
                
                    
                
                var marker = new google.maps.Marker({
                    position: newLatLng,
                    map: map,
                    icon: image,
                    title: punto.nombre,
                    //zIndex: 999
                });
                var infowindow = new google.maps.InfoWindow({
                        content: punto.nombre
                      });
                google.maps.event.addListener(marker, 'click', function(){
                    infowindow.setContent(this.title);
                    infowindow.open(map, this);
                })
                
            }
        }
$scope.localizacionesPresentadas = [];
$scope.listaLocalizaciones = [];

        function cargarMapa() {
            console.log('cargamos mapa...');
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 39.397,
                    lng: -3.644
                },
                zoom: 5
            });

             Localizacion.LocalizacionReto.getById({
                id: 3
            }, function(localizaciones) {
                $scope.listaLocalizaciones = localizaciones;
                $scope.localizacionesPresentadas = [];
                

                /*console.log('porcentaje '+JSON.stringify(porcentaje));    
                var uniqueList = _.uniq(localizaciones, function(item, key, bbb){
                    return item.codigoReto;
                });
                $scope.porcentajeCompletado = (uniqueList.length*100) / $scope.reto.localizaciones.length;
                $scope.porcentajeCompletado = Math.round($scope.porcentajeCompletado *100)/100;
                console.log('$scope.porcentajeCompletado  '+$scope.porcentajeCompletado);    */
                //console.log(JSON.stringify(localizaciones, null, 4));

                for (var i = 0; i < $scope.reto.localizaciones.length; i++) {
                    var localizacionReto = _.find(localizaciones, function(item){
                        return item.codigoReto === $scope.reto.localizaciones[i].codigoReto;
                    });

                    if(_.isUndefined(localizacionReto))
                    {
                        var localizacionVacia = {
                            cloudinaryId: 'esperando-fotografia_fwbidy',
                            titulo: $scope.reto.localizaciones[i].nombre,
                            codigoReto: $scope.reto.localizaciones[i].codigoReto,
                            idLocalizacionReto : $scope.reto.localizaciones[i]._id,
                            url: '#'
                        }
                        //$scope.localizacionesPresentadas.push(localizacionVacia);
                        //console.log('no hay localizacion para  '+JSON.stringify(localizacionVacia));    
                    }
                    else
                    {
                        localizacionReto.titulo = $scope.reto.localizaciones[i].nombre;
                        localizacionReto.idLocalizacionReto = $scope.reto.localizaciones[i]._id;
                        $scope.localizacionesPresentadas.push(localizacionReto);
                        var tituloSeo = $filter('seo')(localizacionReto.titulo);
                        localizacionReto.url = '/localizaciones/'+localizacionReto._id+'/'+tituloSeo;
                        //console.log('localizacionRetoooooo '+JSON.stringify(localizacionReto));    
                    }
                    
                }
                $scope.localizacionesPresentadas = _.uniq($scope.localizacionesPresentadas);
                setMarkers(map);

            });
            
        }

        getListaRetos([]);

    });
