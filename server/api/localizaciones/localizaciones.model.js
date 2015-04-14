'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LocalizacionesSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Localizaciones', LocalizacionesSchema);