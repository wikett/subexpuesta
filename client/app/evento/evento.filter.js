'use strict';

angular.module('subexpuestaV2App')
  .filter('fechaEvento', function ()  {

    return function(text) {

        function cambiarMes(digitos) {
            switch (digitos) {
                case '-01':
                    return 'Enero';
                case '-02':
                    return 'Febrero';
                case '-03':
                    return 'Marzo';
                case '-04':
                    return 'Abril';
                case '-05':
                    return 'Mayo';
                case '-06':
                    return 'Junio';
                case '-07':
                    return 'Julio';
                case '-08':
                    return 'Agosto';
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