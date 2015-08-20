'use strict';

angular.module('subexpuestaV2App')
  .factory('UsuarioAviso', function ($resource) {

    return $resource('/api/users/addaviso/:id', {id: '@_id'},{
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