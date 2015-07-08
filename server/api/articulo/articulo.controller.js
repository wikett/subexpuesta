'use strict';

var _ = require('lodash');
var Articulo = require('./articulo.model');

// Get list of articulos
exports.index = function(req, res) {
  Articulo.find(function (err, articulos) {
    if(err) { return handleError(res, err); }
    return res.json(200, articulos);
  });
};


// Get a single articulo
exports.show = function(req, res) {
  Articulo.findById(req.params.id, function (err, articulo) {
    if(err) { return handleError(res, err); }
    if(!articulo) { return res.send(404); }
    return res.json(articulo);
  });
};

// Creates a new articulo in the DB.
exports.create = function(req, res) {
  Articulo.create(req.body, function(err, articulo) {
    if(err) { return handleError(res, err); }
    return res.json(201, articulo);
  });
};

// Updates an existing articulo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Articulo.findById(req.params.id, function (err, articulo) {
    if (err) { return handleError(res, err); }
    if(!articulo) { return res.send(404); }
    var updated = _.merge(articulo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, articulo);
    });
  });
};
// add Comentario
exports.addComentario = function(req, res) {

  var query = {_id: req.params.id};
  var update = req.body;
  var options = {new: true};
  console.log('query update sorteo: '+req.params.id);
  
  var item = {
    nombre: 'Alfonsito',
    email: 'alfon@sdf.com',
    comentario: 'Todo va bien'
  };
  console.log('req.body: '+JSON.stringify(item));
      Articulo.findOneAndUpdate(
      { _id: req.params.id }, 
      { $push: {comentarios: req.body }},
      { safe: true, upsert: true },
      function(err, articulo){
      if(!err)
      {
        console.log('Comentario anyadido correctamente');
        return res.json(200, articulo);
      }
      else
      {
        console.log('Error addComentario  '+err);
        return handleError(res, err);
      }
      });

};

// Deletes a articulo from the DB.
exports.destroy = function(req, res) {
  Articulo.findById(req.params.id, function (err, articulo) {
    if(err) { return handleError(res, err); }
    if(!articulo) { return res.send(404); }
    articulo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}