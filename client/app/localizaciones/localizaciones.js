'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('localizaciones', {
        url: '/localizaciones-fotografia-nocturna',
        templateUrl: 'app/localizaciones/localizaciones.html',
        controller: 'LocalizacionesMapaCtrl'
      })
      .state('tuslocalizaciones', {
        url: '/tus-localizaciones/:autor',
        templateUrl: 'app/localizaciones/tus-localizaciones.html',
        controller: 'LocalizacionesPortfolioCtrl'
      })
      .state('vistalocalizaciones', {
        url: '/localizaciones/:id/:titulo',
        templateUrl: 'app/localizaciones/vista-localizaciones.html',
        controller: 'LocalizacionesVistaCtrl'
      })
      .state('editarlocalizaciones', {
        url: '/editar-localizaciones/:id/',
        templateUrl: 'app/localizaciones/editar-localizaciones.html',
        controller: 'LocalizacionesEditarCtrl',
        authenticate: true
      })
      .state('adminlocalizaciones', {
        url: '/admin/localizaciones',
        templateUrl: 'app/localizaciones/admin/modificar-localizacion.html',
        controller: 'AdminLocalizacionCtrl',
        authenticate: true
      })
      .state('localizacioncreada', {
        url: '/localizacion-creada/:id/:titulo',
        templateUrl: 'app/localizaciones/localizacion-creada.html',
        controller: 'LocalizacionCreadaCtrl',
        authenticate: true
      })
      .state('mapaspain', {
        url: '/localizaciones/españa',
        templateUrl: 'app/localizaciones/mapaSpain.html',
        controller: 'MapaSpainCtrl',
        })      
      .state('crearlocalizaciones', {
        url: '/crear-localizaciones',
        templateUrl: 'app/localizaciones/crear-localizaciones.html',
        controller: 'LocalizacionesCtrl',
        authenticate: true
      });
     
  });