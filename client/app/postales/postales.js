'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('postales', {
        url: '/sorteo-postales-navidad',
        templateUrl: 'app/postales/postales.html',
        controller: 'PostalesCtrl'
      })
      .state('generar-ganadores', {
        url: '/admin/generar-ganadores',
        templateUrl: 'app/postales/admin/generar-ganadores.html',
        controller: 'AdminPostalesCtrl',
        authenticate: true
      })
      .state('ganadores-postales', {
        url: '/ganadores-postales-navidad',
        templateUrl: 'app/postales/ganadores-postales.html',
        controller: 'PostalesCtrl'
      });
  });
