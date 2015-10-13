'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BoletinSchema = new Schema({
  email: String,
  nombre: String,
  localidad: String,
  origen: String,
  fechaCreacion: {type: Date, default: Date.now},
  estado: {type:Number, default: 0} //0 activo 1 borrado
});

module.exports = mongoose.model('Boletin', BoletinSchema);