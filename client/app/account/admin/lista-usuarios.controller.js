'use strict';

angular.module('subexpuestaV2App')
    .controller('AdminListaUsuariosCtrl', function($scope, $rootScope, $log, User, Auth, $location, Usuario, $http) {

        if (!Auth.isAdmin()) {
            $location.path('/');
        }

        $scope.listaUsuarios = [];

        getUsuarios();


        $scope.usuario = '';


        function getUsuarios() {
            //console.log('findByTitle(): ' + $stateParams.apunteTitulo);
            User.query({}, function(usuarios) {
                $scope.listaUsuarios = usuarios;
            });


        };
        $scope.actualizarVIP = function(isVIPtrue, idUsuario){
            $log.debug('actualizarVIP: '+isVIPtrue);
            if(isVIPtrue)
                modificarUsuarioVIP(idUsuario);
            else
                modificarUsuarioNoVIP(idUsuario);

        }


        $scope.establecerGanador = function(idUsuario) {
                $log.debug('Call ganador');

            $http.get('/api/users/actualizarconcurso/' + idUsuario).success(function(result) {
                        $log.debug('Ganador establecido correctamente');
                    })

        };

        function modificarUsuarioVIP(idUsuario) {

            $http.get('/api/users/actualizarvip/' + idUsuario).success(function(result) {
                        $log.debug('Usuario modificado correctamente');
                    })

        };

        function modificarUsuarioNoVIP(idUsuario) {

            $http.get('/api/users/actualizarnovip/' + idUsuario).success(function(result) {
                        $log.debug('Usuario modificado correctamente');
                    })

        };

    });