'use strict';

angular.module('subexpuestaV2App')
  .factory('RetoLocalizacion', function ($resource) {

    return $resource('/api/retos/addlocalizacion/:id', {id: '@_id'},{
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