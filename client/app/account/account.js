'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('olvide', {
        url: '/olvide-password',
        templateUrl: 'app/account/reset/forgotten.html',
        controller: 'ForgottenCtrl'
      })
      .state('reset', {
        url: '/reset/:token',
        templateUrl: 'app/account/reset/reset.html',
        controller: 'ResetCtrl'
      })
      .state('adminlistadousuarios', {
        url: '/admin/usuarios',
        templateUrl: 'app/account/admin/lista-usuarios.html',
        controller: 'AdminListaUsuariosCtrl',
        authenticate: true
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });