'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('postales', {
        url: '/sorteo-postales-navidad',
        templateUrl: 'app/postales/postales.html',
        controller: 'PostalesCtrl'
      });
  });
