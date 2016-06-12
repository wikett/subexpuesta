'use strict';

var express = require('express');
var controller = require('./reto.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/addlocalizacion/:id', controller.addLocalizacionReto);
router.put('/updatelocalizacion/:id', controller.updateLocalizacionReto);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
