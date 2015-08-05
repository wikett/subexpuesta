'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/removeavisos/:id', controller.removeAvisos);
router.get('/enviaravisos/:id',controller.enviarEmailAvisos);
router.get('/enviaravisossemana/:id',controller.enviarEmailAvisosSemanal);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/datos', auth.isAuthenticated(), controller.actualizarDatos);
router.put('/addaviso/:id', controller.addAviso);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/forgotten', controller.forgottenPassword);
router.post('/reset/:token', controller.resetPassword);
router.get('/usuario/:username', controller.getusuario);

module.exports = router;
