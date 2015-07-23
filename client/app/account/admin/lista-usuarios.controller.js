'use strict';

angular.module('subexpuestaV2App')
    .controller('AdminListaUsuariosCtrl', function($scope, $rootScope, $log, User, Auth, $location, Usuario) {

         if(!Auth.isAdmin())
    {
      $location.path('/');
    }

$scope.listaUsuarios = [];

getUsuarios();

$scope.usuario = '';


        $scope.usuarioAPI = function() {
            //console.log('findByTitle(): ' + $stateParams.apunteTitulo);
            Usuario.getportitulo({
                username: 'wikett'
            }, function(usuario) {
                $scope.usuario = usuario;
            });


        };

            function getUsuarios() {
                //console.log('findByTitle(): ' + $stateParams.apunteTitulo);
                User.query({}, function(usuarios) {
                    $scope.listaUsuarios = usuarios;
                });


            };

    });
