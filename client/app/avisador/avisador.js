'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('avisador', {
        url: '/avisador',
        templateUrl: 'app/avisador/avisador.html',
        controller: 'AvisadorCtrl'
      });
  });
