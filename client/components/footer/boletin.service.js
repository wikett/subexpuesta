'use strict';

angular.module('subexpuestaV2App')
  .factory('Boletin', function ($resource) {

    return $resource('/api/boletines/:id', {id: '@_id'},{
    	update:{
    		method: 'PUT'
    	}
    });
  });
