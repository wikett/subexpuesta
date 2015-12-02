'use strict';

angular.module('subexpuestaV2App')
    .controller('EventoCtrl', function($scope, $rootScope, Evento, $log, $filter, Boletin, $timeout) {

    	$rootScope.title = 'Cursos sobre fotografía nocturna y paisaje';
        $rootScope.metaDescription = 'Cursos de fotografía nocturna, lightpainting, edición y retoque avanzado de paisaje, astrofotografía, y muchas más...';
        $rootScope.titleFB = 'Cursos sobre fotografía nocturna y paisaje';
        $rootScope.descriptionFB = 'Cursos de fotografía nocturna, lightpainting, edición y retoque avanzado de paisaje, astrofotografía, y muchas más...';

    	$scope.correo = '';
        $scope.listaEventos = [];
        $scope.listaSnippet = [];
        $scope.tipoEventos = ['evento-general.png','evento-nocturna.png','evento-edicion.png','evento-online.png','evento-astrofotografia.png','evento-paisaje.png' ]



        function callAtTimeout() {
            $scope.boletinCreado = false;
            $scope.correo = '';
        };

        $scope.guardarEmail = function() {
            $scope.nuevo = new Boletin();
            $scope.nuevo.email = $scope.correo;
            $scope.nuevo.origen = "cursos";

            $scope.nuevo.$save().then(function(response) {
                $scope.boletinCreado = true;
                $timeout(callAtTimeout, 5000);
                //$log.debug('guardado correctamente');
            });
        };

        function getEventos() {
            var fechaHoy = new Date();
            //$log.debug('fechaHoy: ' + fechaHoy);
            Evento.query({}, function(eventos) {
                
               
            $scope.listaEventos = _.filter(eventos, function(v){
                    var aux = new Date(v.fecha);
                    return aux > fechaHoy
                });


                var groupedByMonth = _.groupBy($scope.listaEventos, function(item) {
                    return item.fecha.substring(0, 7);
                });

                //$log.debug('Tengo todos los eventos: '+JSON.stringify(groupedByMonth));

                $scope.eventosAgrupados = groupedByMonth;


                //$log.debug('groupedByMonth: ' + JSON.stringify($scope.eventosAgrupados, null, 4));

                _.each(eventos, function(evento) {
                    var newEvento = {
                        "@context": "http://schema.org",
                        "@type": "Event",
                        "name": evento.titulo,
                        "location": {
                            "@type": "Place",
                            "name": "Aula",
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": evento.localidad,
                                "streetAddress": evento.direccion
                            }
                        },
                        "offers": {
                            "@type": "AggregateOffer",
                            "url": "http://www.subexpuesta.com/" + evento._id +"/"+ $filter('seo')(evento.titulo),
                            "price": evento.precio,
                            "lowprice": evento.precio
                        },
                        "startDate": evento.fecha,
                        "url": "http://www.subexpuesta.com/" + evento._id +"/"+ $filter('seo')(evento.titulo),
                        "organizer": {

                            "name": evento.organizador,
                            "url": evento.web
                        }
                    };
					//$log.debug('newEvento: ' + JSON.stringify(newEvento, null, 4));                    
                    $scope.listaSnippet.push(newEvento);

                });
				$('#json-ld-content').html(JSON.stringify($scope.listaSnippet));

            });

            


        };

        getEventos();

        $scope.oneAtATime = true;

        $scope.groups = [{
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
        }, {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }];

        $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };

        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

    });