'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RetoSchema = new Schema({
  nombre: String,
  fecha: {type: Date, default: Date.now},
  descripcion: String,
  localizaciones: [{latitud:Number, longitud: Number, recibida: Boolean, codigoReto:String, nombre:String, descripcion:String, votos: Number}],
  completado:{type: Boolean, default: false},
  imagen: String
});

module.exports = mongoose.model('Reto', RetoSchema);