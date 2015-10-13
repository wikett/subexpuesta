'use strict';

angular.module('subexpuestaV2App')
    .controller('AdminListaEventoCtrl', function($scope, $rootScope, $log, Evento, Auth, $location) {

         if(!Auth.isAdmin())
    {
      $location.path('/');
    }

$scope.listaEventos = [];

            function getEventos() {
                Evento.query({}, function(eventos) {
                    $scope.listaEventos = eventos;
                });


            };

            getEventos();

    });