'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('recomendaciones', {
        url: '/recomendaciones',
        templateUrl: 'app/recomendaciones/recomendaciones.html',
        controller: 'RecomendacionesCtrl'
      });
  });