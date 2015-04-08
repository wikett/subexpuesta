'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;

  var oldPass = String(req.body.passwordActual);
  var newPass = String(req.body.newPassword);
  var newName = String(req.body.newName);
  var newLocation = String(req.body.newLocation);
  var newWeb = String(req.body.newWeb);
  var newAvatar = String(req.body.newAvatar);
  var newSorteo = Boolean(req.body.newSorteo);
  var newNewsletter = Boolean(req.body.newNewsletter);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      if(newPass!='undefined' && newPass.length>0)
      user.password = newPass;
      if(newName!='undefined' && newName.length>0)
        user.name = newName;
      if(newLocation!='undefined' && newLocation.length>0)
        user.location = newLocation;
      if(newWeb!='undefined' && newWeb.length>0)
        user.web = newWeb;
      if(newAvatar!='undefined' && newAvatar.length>0)
        user.avatar = newAvatar;
      user.participarConcursos = newSorteo;
      user.newsletter = newNewsletter;
      user.save(function(err) {
        if (err) return validationError(res, err);
        console.log('Usuario actualizado correctamente');
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Change a users password
 */
exports.actualizarDatos = function(req, res, next) {
  console.log('Entramos en actualizar Datos Usuario');
  var userId = req.user._id;
  var nombre = String(req.body.nombre);
  var web = String(req.body.web);
  
  return res.send(204);
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
