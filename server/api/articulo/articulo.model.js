'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticuloSchema = new Schema({
  titulo: String,
  contenido: String,
  contenidoHTML: String,
  autor: String,
  fechaCreacion: {type: Date, default: Date.now},
  imagen: String,
  tags: [String],
  comentarios: [{nombre: String, email: String, comentario: String, fechaComentario: {type: Date, default: Date.now}, estado: {type: Number, default: 0}}],
  estado: {type: Number, default: 0},
  categoria: {type: Number, default:0} 
});

module.exports = mongoose.model('Articulo', ArticuloSchema);