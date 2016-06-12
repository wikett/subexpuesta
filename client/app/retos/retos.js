'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
    .state('crearreto', {
        url: '/admin/crear-retos',
        templateUrl: 'app/retos/admin/crear-reto.html',
        controller: 'CrearRetoCtrl',
        authenticate: true
      })
    .state('editarreto', {
        url: '/admin/editar-reto/:id/',
        templateUrl: 'app/retos/admin/editar-reto.html',
        controller: 'EditarRetoCtrl',
        authenticate: true
      })
    .state('anyadirlocalizacionretos', {
        url: '/admin/anyadir-localizacion-retos/:id/',
        templateUrl: 'app/retos/admin/anyadir-localizacion-retos.html',
        controller: 'AnyadirLocalizacionRetosCtrl',
        authenticate: true
      })
    .state('editarlocalizacionretos', {
        url: '/admin/editar-localizacion-retos/:id/',
        templateUrl: 'app/retos/admin/editar-localizacion-reto.html',
        controller: 'EditarLocalizacionRetosCtrl',
        authenticate: true
      })
      .state('retos', {
        url: '/retos',
        templateUrl: 'app/retos/retos.html',
        controller: 'RetosCtrl'
      })
      .state('retoindividual', {
        url: '/retos/:nombre',
        templateUrl: 'app/retos/reto-individual.html',
        controller: 'RetoIndividualCtrl'
      })
      .state('retolocalizacion', {
        url: '/reto-localizacion/:nombre/:localizacion',
        templateUrl: 'app/retos/reto-localizacion.html',
        controller: 'RetoLocalizacionCtrl'
      })
      .state('reto', {
        url: '/reto/:id',
        templateUrl: 'app/retos/reto-individual.html',
        controller: 'RetoIndividualCtrl'
      });
  });
