'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('evento', {
        url: '/cursos-sobre-fotografia-nocturna-y-paisaje',
        templateUrl: 'app/evento/evento.html',
        controller: 'EventoCtrl'
      })
      .state('singleevento', {
        url: '/cursos/:id/:titulo',
        templateUrl: 'app/evento/evento-single.html',
        controller: 'SingleEventoCtrl'
      })
      .state('peticionevento', {
        url: '/cursos/agregar-nuevo-curso',
        templateUrl: 'app/evento/evento-peticion.html',
        controller: 'EventoPeticionCtrl'
      })
      .state('crearevento', {
        url: '/admin/crear-evento',
        templateUrl: 'app/evento/admin/crear-evento.html',
        controller: 'CrearEventoCtrl',
        authenticate: true
      })
      .state('modificarevento', {
        url: '/admin/modificar-evento/:id/',
        templateUrl: 'app/evento/admin/modificar-evento.html',
        controller: 'ModificarEventoCtrl',
        authenticate: true
      })
      .state('listadoeventos', {
        url: '/admin/listado-eventos',
        templateUrl: 'app/evento/admin/lista-evento.html',
        controller: 'AdminListaEventoCtrl',
        authenticate: true
      });
  });
