'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BoletinSchema = new Schema({
  email: String,
  nombre: String,
  localidad: String,
  origen: String,
  fechaCreacion: {type: Date, default: Date.now},
  estado: Number
});

module.exports = mongoose.model('Boletin', BoletinSchema);