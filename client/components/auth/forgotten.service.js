
'use strict';

angular.module('subexpuestaV2App')
  .factory('Forgotten', function ($resource) {

    return $resource('/api/users/forgotten/:id', {id: '@_id'},{
      update:{
        method: 'PUT'
      }
    });
  });