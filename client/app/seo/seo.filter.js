'use strict';

angular.module('subexpuestaV2App')
  .filter('seo', function ()  {

    return function(text) {

        function eliminaracento(letra) {
            switch (letra) {
                case 'á':
                    return 'a';
                case 'é':
                    return 'e';
                case 'í':
                    return 'i';
                case 'ó':
                    return 'o';
                case 'ú':
                    return 'u';
                case 'ñ':
                    return 'n';
                default:
                    return letra;
            }
        }; //
        function eliminarcaracteres(text) {
            var newtext = '';
            for (var i in text) {
                newtext += eliminaracento(text[i]);
            };
            return newtext;
        }; //fin funcion
        if(!_.isUndefined(text))
        return eliminarcaracteres(text.toLowerCase()).replace(/[-\s]+/g, '-') // convert spaces to hyphens
            .replace(/[^-\w\s]/g, '') // remove unneeded chars
            .replace(/^\s+|\s+$/g, '') + ''; // trim leading/trailing spaces

    };
  });
