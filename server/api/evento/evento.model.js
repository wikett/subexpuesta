'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventoSchema = new Schema({
  estado: {type: Number, default: 0}, // 0 Activo, 1 Completo 3 Cancelado 4 Eliminado
  categoria: Number, // 0 General, 1 Nocturna-Lightpainting, 2 Edicion, 3 Online 4 Astrofotografia,5 Paisaje
  titulo: String,
  organizador: String,
  fechaCreacion: {type: Date, default: Date.now},
  fecha: Date,
  capacidad: Number,
  descripcion: String,
  urlImagen: String,
  cloudinaryId: String,
  localidad: String,
  direccion: String,
  latitud: Number,
  longitud: Number,
  precio: Number,
  web: String,
  emailContacto: String,
  destacado: Boolean,
  participantes: [{nombre: String, email: String, fecha: {type: Date, default: Date.now}, estado: {type: Number, default: 0}}]
});

module.exports = mongoose.model('Evento', EventoSchema);