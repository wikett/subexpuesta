'use strict';

angular.module('subexpuestaV2App')
    .factory('Localizacion', function($resource) {

        return {
            LocalizacionAPI: $resource('/api/localizaciones/:id', {
                id: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            }),
            LocalizacionReto: $resource('/api/localizaciones/retos/:id', {
                id: '@_id'
            }, {
                getById: {
                    method: 'GET',
                    isArray: true,
                    params: {
                        id: '@autor'
                    }
                }
            }),
            LocalizacionAutor: $resource('/api/localizaciones/autor/:autor', {
                autor: '@_id'
            }, {
                getByAutor: {
                    method: 'GET',
                    isArray: true,
                    params: {
                        autor: '@autor'
                    }
                }

            })
        };

    });