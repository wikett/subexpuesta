'use strict';

angular.module('subexpuestaV2App')
  .factory('Mejora', function ($resource) {

    return $resource('/api/mejoras/:id', {id: '@_id'},{
    	update:{
    		method: 'PUT'
    	}
    });
  });
