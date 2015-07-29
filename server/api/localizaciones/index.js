'use strict';

var express = require('express');
var controller = require('./localizaciones.controller');

var router = express.Router();

// a middleware with no mount path, gets executed for every request to the router
//router.use(function (req, res, next) {
//  console.log('User-Agent: ' + req.headers['user-agent']);
// res.set('Content-Type', 'text/html');
//res.send(new Buffer('<p>some html</p>'));
 // res.end()
  //next();
  //res.sendFile('client/index-fb.html');
  //res.send(202);
  //res.end();
  //next();
  //res.render('index-fb.html');
//});

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/autor/:autor', controller.getLocalizacionesByUser);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;