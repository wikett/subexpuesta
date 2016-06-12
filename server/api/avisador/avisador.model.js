'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AvisadorSchema = new Schema({
  donde: String,
  fechaCreacion: {type: Date, default: Date.now},
  fecha: {type: Date},
  creador: String,
  horaSalida: Date,
  horaLlegada: Date,
  destinatarios: [{nombre: String, email:String}],  
  latitud: Number,
  longitud: Number,
  mensaje: String,
  publico: Boolean  
});

module.exports = mongoose.model('Avisador', AvisadorSchema);