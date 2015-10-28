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
  distanciakm: Number,
  lugarPublico: Boolean,
  acceso: String,
  facilidadAcceso: Number,
  peligrosidad: Number,
  contaminacionLuminica: Number,
  notasAdicionales: String,
  direccion: String,
  categoria: {type: Number, default: 0}, //Nocturnas: 0 Nocturna Paisaje, 1 Nocturna Urbana, 2 LightPainting 3 Atardecer-Amanecer, 4 Monumentos, 5 Ruinas, 6 Vehiculos-Maquinarias, 7 Mineria. No solo Nocturnas: 8 Paisaje, 9 Larga Exposicion Diurna, 10 Urbana 11 Costa
  estado: {type: Number, default: 0} // 0->Pendiente de revisar 5-> Borrada
});

module.exports = mongoose.model('Localizaciones', LocalizacionesSchema);