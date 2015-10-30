'use strict';

angular.module('subexpuestaV2App')
  .factory('Usuario', function ($resource) {

    return $resource('/api/users/usuario/:id', {id: '@_id'},{
      update:{
        method: 'PUT'
      },
       get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      getportitulo: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                }
    });
  });

