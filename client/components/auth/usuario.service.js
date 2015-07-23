'use strict';

angular.module('subexpuestaV2App')
  .factory('Usuario', function ($resource) {

    return $resource('/api/users/usuario/:username', {username: '@_id'},{
      update:{
        method: 'PUT'
      },
      getportitulo: {
                    method: 'GET',
                    params: {
                        username: '@id'
                    }
                }
    });
  });

