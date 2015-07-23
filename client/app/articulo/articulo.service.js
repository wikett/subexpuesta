'use strict';

angular.module('subexpuestaV2App')
  .factory('Articulo', function ($resource) {

    return $resource('/api/articulos/:id', {id: '@_id'},{
    	update:{
    		method: 'PUT'
    	}
    });
  });
