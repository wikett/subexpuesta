'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sobremi', {
        url: '/sobrenosotros',
        templateUrl: 'app/sobremi/sobremi.html',
        controller: 'SobremiCtrl'
      });
  });