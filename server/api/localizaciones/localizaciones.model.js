'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LocalizacionesSchema = new Schema({
  titulo: String,
  fechaSubida: {type: Date, default: Date.now},
  fechaToma: {type: Date, default: Date.now},
  autor: String,
  votos: {type: Number, default: 0},
  cloudinaryId: String,
  tags: [String],
  latitud: Number,
  longitud: Number,
  lugarPublico: Boolean,
  acceso: String,
  facilidadAcceso: Number,
  contaminacionLuminica: Number,
  notasAdicionales: String,
  estado: {type: Number, default: 0} // 0->Pendiente de revisar
});

module.exports = mongoose.model('Localizaciones', LocalizacionesSchema);