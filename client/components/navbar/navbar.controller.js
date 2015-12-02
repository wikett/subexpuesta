'use strict';

angular.module('subexpuestaV2App')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $log, User, $filter) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.listaUsuarios = [];

    $scope.menuExpandido = false;

    $scope.cerrarMenu = function(){
      $scope.menuExpandido = false;      
    };

    $scope.abrirMenu = function(){
      $scope.menuExpandido = true;      
    };

    $scope.swapMenu = function(){
      $scope.menuExpandido = !$scope.menuExpandido;      
    }

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

            function getUsuarios() {
            //console.log('findByTitle(): ' + $stateParams.apunteTitulo);
            User.query({}, function(usuarios) {
                $scope.listaUsuarios = usuarios;
                $scope.listadoGanadores = $filter('filter')($scope.listaUsuarios, function(o){
                    return o.ganadorPostales===true;
                });
                //$log.debug('$scope.listadoGanadores: '+JSON.stringify($scope.listadoGanadores));

            });


        };

         getUsuarios();

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });