'use strict';

angular.module('subexpuestaV2App')
  .factory('Reto', function ($resource) {

    return $resource('/api/retos/:id', {id: '@_id'},{
    	update:{
    		method: 'PUT'
    	}
    });
  });