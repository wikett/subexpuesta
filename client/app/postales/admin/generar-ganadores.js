'use strict';

angular.module('subexpuestaV2App')
    .controller('AdminPostalesCtrl', function($scope, $rootScope, $log, User, Auth, $location, Usuario, $http, Localizacion) {

        if (!Auth.isAdmin()) {
            $log.debug('No es admin');
            $location.path('/');
        }

        $scope.listaUsuarios = [];
        $scope.misLocalizaciones = [];
        $scope.fechaHoy = new Date();

        $scope.participantes = [];
        $scope.ganadores = [];

        function getLocalizaciones() {
            $scope.listaLocalizaciones = Localizacion.LocalizacionAPI.query(function() {


                _.each($scope.listaLocalizaciones, function(loca) {
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
                        fechaCreacion: loca.fechaSubida,
                        icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
                        events: {
                            click: function(map, eventName, handlerArgs) {

                                $scope.$apply(function() {
                                    //$log.log('click event');
                                    //$log.log('click: '+JSON.stringify(handlerArgs));
                                    $scope.destinoModal = handlerArgs._id;

                                    $scope.destinoTituloModal = handlerArgs.titulo;
                                    $scope.abrir(handlerArgs);

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
                                });
                            }
                        }

                    };
                    if (loca.estado != 2)
                        $scope.misLocalizaciones.push(ret);
                });

                var uniqueAutor = _.countBy($scope.misLocalizaciones, "autor");

                //$log.debug('$scope.fechaHoy.getMonth(): '+$scope.fechaHoy.getMonth());
                var fechaEsteMes = new Date($scope.fechaHoy.getFullYear(), 10, 1);
                //$log.debug('fechaEsteMes: ' + fechaEsteMes);


                $scope.topUsuariosMensual = _.filter($scope.misLocalizaciones, function(v) {
                    var aux = new Date(v.fechaCreacion);
                    //$log.debug(aux);
                    return aux > fechaEsteMes
                });

                $scope.topUsuariosMensual = _.countBy($scope.topUsuariosMensual, "autor");
                $scope.topUsuariosMensual = _.map($scope.topUsuariosMensual, function(value, key) {
                    return {
                        autor: key,
                        total: value
                    };
                });

            })
        };


        getLocalizaciones();

        getUsuarios();


        $scope.usuario = '';

        $scope.calcularNuevo = function(){
           // $log.debug('entro en calcular: '+$scope.topUsuariosMensual.length);
            $scope.ganadores = [];
            $scope.participantes = [];
            var i=0;
            while(i<$scope.topUsuariosMensual.length){
                
                //$log.debug('usuario: '+JSON.stringify($scope.topUsuariosMensual[i], null, 4));

                if($scope.topUsuariosMensual[i].autor!=="Mónica")
                {
                    $scope.ganadores.push($scope.topUsuariosMensual[i].autor);
                }
                
                i++;
            }
            $scope.ganadores.push("Mónica");
            

            $log.debug(JSON.stringify($scope.ganadores));
        }

        /*$scope.calcular = function(){
           // $log.debug('entro en calcular: '+$scope.topUsuariosMensual.length);
            $scope.ganadores = [];
            $scope.participantes = [];
            var i=0;
            while(i<$scope.topUsuariosMensual.length){
                
                //$log.debug('usuario: '+JSON.stringify($scope.topUsuariosMensual[i], null, 4));
                for (var j = 0; j < $scope.topUsuariosMensual[i].total; j++) {
                    //$log.debug('total: '+j);
                    $scope.participantes.push($scope.topUsuariosMensual[i].autor);
                };
                i++;
            }
            $log.debug(JSON.stringify($scope.participantes));
            var maximo = 0;
            while(maximo<21){
                var numeroAleatorio = Math.floor(Math.random()*$scope.participantes.length);
                $log.debug('numero Aleatorio: '+numeroAleatorio);
                var item = $scope.participantes[numeroAleatorio];
                $log.debug('item: '+item);
                if(item!=="quique_aparicio" && item !== "Danielafote" && item !=="luis muñoz")
                {
                    if(!_.contains($scope.ganadores,item))
                    {
                        
                        //$log.debug("USU: "+JSON.stringify(usu));                    
                        //$log.debug(JSON.stringify($scope.listaUsuarios));
                        $scope.ganadores.push(item);
                        maximo++;
                    }
                }

            }

            $log.debug(JSON.stringify($scope.ganadores));
        }*/

        $scope.establecerGanador = function() {
                $log.debug('establecerGanador');

                for (var i = 0; i < $scope.ganadores.length; i++) {
                    var usu = _.findWhere($scope.listaUsuarios, {username: $scope.ganadores[i]});
                    $log.debug(JSON.stringify(usu._id));
                     $http.get('/api/users/actualizarconcurso/' + usu._id).success(function(result) {
                        $log.debug('Ganador establecido correctamente');
                    })

                };
                
           
        };
        function getUsuarios() {
            //console.log('findByTitle(): ' + $stateParams.apunteTitulo);
            User.query({}, function(usuarios) {
                $scope.listaUsuarios = usuarios;
            });


        };


    });