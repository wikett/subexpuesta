'use strict';

angular.module('subexpuestaV2App')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $log) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.menuExpandido = false;

    $scope.cerrarMenu = function(){
      $log.debug('Cerrar Menu');
      $scope.menuExpandido = false;      
    };

    $scope.abrirMenu = function(){
      $log.debug('Abrir Menu');
      $scope.menuExpandido = true;      
    };

    $scope.swapMenu = function(){
      $scope.menuExpandido = !$scope.menuExpandido;      
    }

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });