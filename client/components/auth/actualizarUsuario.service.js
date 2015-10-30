'use strict';

angular.module('subexpuestaV2App')
  .factory('ActualizarUsuario', function ($resource) {

    return $resource('/api/users/actualizar/:id', {
    	id: '@_id'},{
      update:{
        method: 'PUT'
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
    });
  });

