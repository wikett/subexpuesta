'use strict';

angular.module('subexpuestaV2App')
  .factory('RetoUpdateLocalizacion', function ($resource) {

    return $resource('/api/retos/updatelocalizacion/:id', {id: '@_id'},{
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