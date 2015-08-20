'use strict';

var express = require('express');
var controller = require('./localizaciones.controller');

var router = express.Router();


router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/autor/:autor', controller.getLocalizacionesByUser);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;