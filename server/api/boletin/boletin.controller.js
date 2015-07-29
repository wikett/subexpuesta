'use strict';

var _ = require('lodash');
var Boletin = require('./boletin.model');

// Get list of boletins
exports.index = function(req, res) {
  Boletin.find(function (err, boletins) {
    if(err) { return handleError(res, err); }
    return res.json(200, boletins);
  });
};

// Get a single boletin
exports.show = function(req, res) {
  Boletin.findById(req.params.id, function (err, boletin) {
    if(err) { return handleError(res, err); }
    if(!boletin) { return res.send(404); }
    return res.json(boletin);
  });
};

// Creates a new boletin in the DB.
exports.create = function(req, res) {
  Boletin.create(req.body, function(err, boletin) {
    if(err) { return handleError(res, err); }
    return res.json(201, boletin);
  });
};

// Updates an existing boletin in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Boletin.findById(req.params.id, function (err, boletin) {
    if (err) { return handleError(res, err); }
    if(!boletin) { return res.send(404); }
    var updated = _.merge(boletin, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, boletin);
    });
  });
};

// Deletes a boletin from the DB.
exports.destroy = function(req, res) {
  Boletin.findById(req.params.id, function (err, boletin) {
    if(err) { return handleError(res, err); }
    if(!boletin) { return res.send(404); }
    boletin.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}