'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('localizaciones', {
        url: '/localizaciones',
        templateUrl: 'app/localizaciones/localizaciones.html',
        controller: 'LocalizacionesCtrl'
      });
  });