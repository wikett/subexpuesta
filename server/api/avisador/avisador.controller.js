'use strict';

var _ = require('lodash');
var Avisador = require('./avisador.model');

// Get list of eventos
exports.index = function(req, res) {
  Avisador.find(function (err, avisadors) {
    if(err) { return handleError(res, err); }
    return res.json(200, avisadors);
  });
};

// Get a single avisador
exports.show = function(req, res) {
  Avisador.findById(req.params.id, function (err, avisador) {
    if(err) { return handleError(res, err); }
    if(!avisador) { return res.send(404); }
    return res.json(avisador);
  });
};

// Creates a new avisador in the DB.
exports.create = function(req, res) {
  Avisador.create(req.body, function(err, avisador) {
    if(err) { return handleError(res, err); }
    return res.json(201, avisador);
  });
};

// Updates an existing avisador in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Avisador.findById(req.params.id, function (err, avisador) {
    if (err) { return handleError(res, err); }
    if(!avisador) { return res.send(404); }
    var updated = _.merge(avisador, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, avisador);
    });
  });
};

// Deletes a evento from the DB.
exports.destroy = function(req, res) {
  Avisador.findById(req.params.id, function (err, avisador) {
    if(err) { return handleError(res, err); }
    if(!avisador) { return res.send(404); }
    avisadors.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}