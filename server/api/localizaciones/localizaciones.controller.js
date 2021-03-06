'use strict';

var _ = require('lodash');
var Localizaciones = require('./localizaciones.model');
var fs = require('fs');
var http = require('http');

// Get list of localizacioness
exports.index = function(req, res) {

  Localizaciones.find(function (err, localizacioness) {
    if(err) { return handleError(res, err); }
    return res.json(200, localizacioness);
    //return res.send(200);
  });
 
};


resetPasswordExpires: { $gt: Date.now() } 

exports.getRetos = function(req, res){
  console.log('obtenemos localizaciones con reto');
  Localizaciones.find({codigoReto: {$ne:null}, estado: {$ne:2}}, function(err, localizaciones){
    if(err) { return handleError(res, err); }
    if(!localizaciones) { return res.send(404); }
    return res.json(localizaciones);
  })
};

// Get a list of localizaciones by User
exports.getLocalizacionesByUser = function(req, res){
  //console.log('getLocalizacionesByUser: '+req.params.autor);
  Localizaciones.find({ autor: req.params.autor, estado: { $lt: 5 } }, function(err, localizaciones){
    if(err) { return handleError(res, err); }
    if(!localizaciones) { return res.send(404); }
    return res.json(localizaciones);
  });
};

// Get a single localizaciones
exports.show = function(req, res) {
  Localizaciones.findById(req.params.id, function (err, localizaciones) {
    if(err) { return handleError(res, err); }
    if(!localizaciones) { return res.send(404); }
    return res.json(localizaciones);
  });
};

// Creates a new localizaciones in the DB.
exports.create = function(req, res) {
  Localizaciones.create(req.body, function(err, localizaciones) {
    if(err) { return handleError(res, err); }
    return res.json(201, localizaciones);
  });
};

// Updates an existing localizaciones in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Localizaciones.findById(req.params.id, function (err, localizaciones) {
    if (err) { return handleError(res, err); }
    if(!localizaciones) { return res.send(404); }
    var updated = _.merge(localizaciones, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, localizaciones);
    });
  });
};

// Deletes a localizaciones from the DB.
exports.destroy = function(req, res) {
  Localizaciones.findById(req.params.id, function (err, localizaciones) {
    if(err) { return handleError(res, err); }
    if(!localizaciones) { return res.send(404); }
    localizaciones.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}