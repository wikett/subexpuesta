
'use strict';

angular.module('subexpuestaV2App')
    .factory('Email', function($resource) {

        return {
            EmailAPI: $resource('/api/emails/:id', {
                id: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            }),
            EmailEnviar: $resource('/api/emails/enviarmail', {
                autor: '@_id'
            }, {
                enviarMail: {
                    method: 'POST'
                }

            }),
            EmailEnviarContacto: $resource('/api/emails/enviarmailcontacto', {
                autor: '@_id'
            }, {
                enviarMailContacto: {
                    method: 'POST'
                }

            })
        };

    });