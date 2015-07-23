'use strict';

angular.module('subexpuestaV2App')
  .factory('ArticuloComentario', function ($resource) {

    return $resource('/api/articulos/addcomentario/:id', {id: '@_id'},{
    	update:{
    		method: 'PUT'
    	}
    });
  });