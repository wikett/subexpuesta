'use strict';

angular.module('subexpuestaV2App')
  .factory('Evento', function ($resource) {

    return $resource('/api/eventos/:id', {id: '@_id'},{
    	update:{
    		method: 'PUT'
    	}
    });
  });
