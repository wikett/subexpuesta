'use strict';

var _ = require('lodash');
var Mejora = require('./mejora.model');

// Get list of mejoras
exports.index = function(req, res) {
  console.log('peticion de todas las mejoras');
  Mejora.find(function (err, mejoras) {
    if(err) { return handleError(res, err); }
    return res.json(200, mejoras);
  });
};

// Get a single mejora
exports.show = function(req, res) {
  Mejora.findById(req.params.id, function (err, mejora) {
    if(err) { return handleError(res, err); }
    if(!mejora) { return res.send(404); }
    return res.json(mejora);
  });
};

// Creates a new mejora in the DB.
exports.create = function(req, res) {
  Mejora.create(req.body, function(err, mejora) {
    if(err) { return handleError(res, err); }
    return res.json(201, mejora);
  });
};

// Updates an existing mejora in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Mejora.findById(req.params.id, function (err, mejora) {
    if (err) { return handleError(res, err); }
    if(!mejora) { return res.send(404); }
    var updated = _.merge(mejora, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, mejora);
    });
  });
};

// Deletes a mejora from the DB.
exports.destroy = function(req, res) {
  Mejora.findById(req.params.id, function (err, mejora) {
    if(err) { return handleError(res, err); }
    if(!mejora) { return res.send(404); }
    mejora.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}