'use strict';

angular.module('subexpuestaV2App')
  .factory('Modal', function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            //console.log('arguments: '+JSON.stringify(arguments));
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirmacion de borrado',
                html: '<p>¿Estás seguro de borrar la localización: <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Borrar',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancelar',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        },
        localizacionCreada: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            //console.log('arguments: '+JSON.stringify(arguments));
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Localización creada!!',
                html: '<p>¿Quieres subir una localizacion nueva?</p>',
                buttons: [{
                  classes: 'btn-success',
                  text: 'Crear Nueva Localización',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-primary',
                  text: 'Continuar',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-success');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        },
        visitarLocalizacion: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            //console.log('arguments: '+JSON.stringify(arguments, null, 4));
            
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Localizador de Fotografías Nocturnas',
                html: '<div class="row"><div class="col-md-7"><img src="http://res.cloudinary.com/djhqderty/image/upload/c_scale,q_29,w_300/v1429114149/'+arguments[0].id+'.jpg" width="300px" title="'+arguments[0].titulo+'" /></div><div class="col-md-5" style="padding:0px;"><p><strong>Titulo:</strong> '+arguments[0].titulo+'</p><p><strong>Latitud:</strong> '+arguments[0].latitude+'</p><p><strong>Longitud:</strong> '+arguments[0].longitude+'</p><p><strong>Peligrosidad de acceso:</strong> '+arguments[0].peligrosidad+'/10</p><p><strong>Contaminación lumínica:</strong> '+arguments[0].contaminacion+'/10</p></div></div>',
                buttons: [{
                  classes: 'btn-success',
                  text: 'Ver Localización',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-primary',
                  text: 'Cerrar',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-info');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        },
        borrarLocalizacion: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            //console.log('arguments: '+JSON.stringify(arguments));
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirmacion de borrado',
                html: '<p>¿Estás seguro de borrar la localización: <strong>' + name.titulo + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Borrar',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancelar',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  });
