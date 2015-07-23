'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('terminos', {
        url: '/terminos-de-uso',
        templateUrl: 'app/main/terminos.html',
        controller: 'MainCtrl'
      })
       .state('cookies', {
        url: '/cookies',
        templateUrl: 'app/main/cookies.html'
      })       
      .state('sitemap', {
        url: '/sitemap',
        templateUrl: 'app/main/sitemap.html',
        controller: 'SiteMapCtrl'
      });
  });