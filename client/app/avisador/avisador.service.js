'use strict';

angular.module('subexpuestaV2App')
  .factory('Avisador', function ($resource) {

    return $resource('/api/avisadors/:id', {id: '@_id'},{
    	update:{
    		method: 'PUT'
    	}
    });
  });