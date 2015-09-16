/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/eventos', require('./api/evento'));
  app.use('/api/tools', require('./api/tool'));
  app.use('/api/boletines', require('./api/boletin'));
  app.use('/api/articulos', require('./api/articulo'));
  app.use('/api/emails', require('./api/email'));
  app.use('/api/localizaciones', require('./api/localizaciones'));
  app.use('/api/mejoras', require('./api/mejora'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      console.log('appPath: '+app.get('appPath'));
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
