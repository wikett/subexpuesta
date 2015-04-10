'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mejora', {
        url: '/mejora',
        templateUrl: 'app/mejora/mejora.html',
        controller: 'MejoraCtrl'
      });
  });