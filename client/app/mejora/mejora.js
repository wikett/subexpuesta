'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mejora', {
        url: '/mejora',
        templateUrl: 'app/mejora/mejora.html',
        controller: 'MejoraCtrl'
      })
      .state('gestionboletin', {
        url: '/admin/boletin',
        templateUrl: 'app/mejora/admin/gestion-boletin.html',
        controller: 'AdminBoletinCtrl'
      })
      .state('adminmejora', {
        url: '/admin/mejora',
        templateUrl: 'app/mejora/admin/modificar-mejora.html',
        controller: 'AdminMejoraCtrl',
        authenticate: true
      });
  });