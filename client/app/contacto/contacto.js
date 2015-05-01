'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('contacto', {
        url: '/contacto',
        templateUrl: 'app/contacto/contacto.html',
        controller: 'ContactoCtrl'
      });
  });