'use strict';

angular.module('subexpuestaV2App')
  .factory('ActualizarUsuario', function ($resource) {

    return $resource('/api/users/actualizar/:username', {username: '@_id'},{
      update:{
        method: 'PUT'
      }
    });
  });
