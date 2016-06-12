'use strict';

var _ = require('lodash');
var Reto = require('./reto.model');

// Get list of eventos
exports.index = function(req, res) {
  Reto.find(function (err, retos) {
    if(err) { return handleError(res, err); }
    return res.json(200, retos);
  });
};

// Get a single retos
exports.show = function(req, res) {
  Reto.findById(req.params.id, function (err, reto) {
    if(err) { return handleError(res, err); }
    if(!reto) { return res.send(404); }
    return res.json(reto);
  });
};

// Creates a new retos in the DB.
exports.create = function(req, res) {
  Reto.create(req.body, function(err, retos) {
    if(err) { return handleError(res, err); }
    return res.json(201, retos);
  });
};

// Updates an existing retos in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Reto.findById(req.params.id, function (err, retos) {
    if (err) { return handleError(res, err); }
    if(!retos) { return res.send(404); }
    var updated = _.merge(retos, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, retos);
    });
  });
};

// Deletes a evento from the DB.
exports.destroy = function(req, res) {
  Reto.findById(req.params.id, function (err, retos) {
    if(err) { return handleError(res, err); }
    if(!retos) { return res.send(404); }
    retos.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// add Localizacion Reto
exports.addLocalizacionReto = function(req, res) {

    var query = {
        _id: req.params.id
    };
    var update = req.body;
    var options = {
        new: true
    };
    console.log('addLocalizacionReto -> req.body: ' + JSON.stringify(req.body));
    Reto.findByIdAndUpdate(
             req.params.id
        , {
            $push: {
                localizaciones: req.body
            }
        }, {
            safe: true,
            upsert: true
        },
        function(err, reto) {
            if (!err) {
                console.log('Nueva localizacion reto anyadida correctamente');
                return res.json(200, reto);
            } else {
                console.log('Error addLocalizacionReto  ' + err);
                return handleError(res, err);
            }
        });
};

// update Localizacion Reto
exports.updateLocalizacionReto = function(req, res) {

    var query = {
        _id: req.params.id
    };
    var update = req.body;
    var options = {
        new: true
    };
    console.log('updateLocalizacionReto -> req.body: ' + JSON.stringify(req.body));
    //Reto.update({localizaciones._id: req.body._id}, {})
    Reto.update({
            'localizaciones._id': req.params.id
        }, {
            $set: {
                'localizaciones.$.nombre': req.body.nombre,
                'localizaciones.$.descripcion': req.body.descripcion,
                'localizaciones.$.codigoReto': req.body.codigoReto,
                'localizaciones.$.longitud': req.body.longitud,
                'localizaciones.$.latitud': req.body.latitud,
                'localizaciones.$.recibida': req.body.recibida
            }
        }, {
            safe: true,
            upsert: true
        },
        function(err, reto) {
            if (!err) {
                console.log('Localizacion editada correctamente');
                return res.json(200, reto);
            } else {
                console.log('Error updateLocalizacionReto  ' + err);
                return handleError(res, err);
            }
        });

};


function handleError(res, err) {
  return res.send(500, err);
}