'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MejoraSchema = new Schema({
  autor: String,
  fecha: {type: Date, default: Date.now},
  descripcion: String,
  votos: {type: Number, default: 0},
  estado: {type: Number, default: 0} // 0->Pendiente de hacer, 1->En proceso 2->Realizado 3->Rechazado 4->Borrado
});

module.exports = mongoose.model('Mejora', MejoraSchema);