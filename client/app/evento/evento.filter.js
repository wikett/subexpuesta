'use strict';

angular.module('subexpuestaV2App')
  .filter('fechaEvento', function ()  {

    return function(text) {

        function cambiarMes(digitos) {
            switch (digitos) {
                case '-09':
                    return 'Septiembre';
                case '-10':
                    return 'Octubre';
                case '-11':
                    return 'Noviembre';
                case '-12':
                    return 'Diciembre';
                default:
                    return digitos;
            }
        }; //
        if(!_.isUndefined(text))
        return cambiarMes(text.substring(4,7))+" de "+text.substring(0,4);

    };
  });