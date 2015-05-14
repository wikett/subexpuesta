'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

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
      if(newPass!=='undefined' && newPass.length>0)
      user.password = newPass;
      if(newName!=='undefined' && newName.length>0)
        user.name = newName;
      if(newLocation!=='undefined' && newLocation.length>0)
        user.location = newLocation;
      if(newWeb!=='undefined' && newWeb.length>0)
        user.web = newWeb;
      if(newAvatar!=='undefined' && newAvatar.length>0)
        user.avatar = newAvatar;
      user.participarConcursos = newSorteo;
      user.newsletter = newNewsletter;
      user.save(function(err) {
        if (err) return validationError(res, err);
        
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/*
 * Forgotten password
 */
 exports.forgottenPassword = function(req, res, next)
 {
    console.log('Forgotten password: '+req.body.email);
    async.waterfall([
      function(done){
       crypto.randomBytes(20, function(err, buf){
        var token = buf.toString('hex');
        console.log('Creamos el token: '+token);
        done(err, token);
       });
      },
      function(token, done){
        console.log('Buscamos al usuario');
        User.findOne({email: req.body.email}, function(err, user){
          if(!user){
            return res.send(500, err);
          }

          user.resetPasswordToken = token;
          //user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.resetPasswordExpires = Date.now() + 60000; // 1 minuto

          user.save(function(err){
            done(err, token, user);
          });
        });
      },
      function(token, user, done){
        console.log('Enviamos mail: req.headers.host '+req.headers.host);
      var options = {
          auth: {
              api_user: 'wikett',
              api_key: 'poiuasdf77'
          }
      };

        var mailer = nodemailer.createTransport(sgTransport(options));
        var email = {
            to: user.email,
            from: 'info@subexpuesta.com',
            subject: 'Olvide mi password para www.subexpuesta.com',
            text: 'Acabas de recibir este email porque tú (o alguien) ha pedido resetear tu contraseña para tu cuenta.\n\n' +
          'Por favor pinche en el siguiente enlace, o copie y pegue en tu navegador para completar el proceso:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'Si no ha hecho esta petición de resetear su contraseña, por favor ignore este email (su contraseña no será cambiada).\n\n\n' +
          'Atentamente, '+
          'Servicio Técnico de www.subexpuesta.com'/*,
          html:'Acabas de recibir este email porque tú (o alguien) ha pedido resetear tu contraseña para tu cuenta.<br/><br/>' +
          'Por favor pinche en el siguiente enlace, o copie y pegue en tu navegador para completar el proceso:<br/><br/>' +
          '<a href="http://' + req.headers.host + '/reset/' + token + '">http://' + req.headers.host + '/reset/' + token +'</a><br/><br/>' +
          'Si no ha hecho esta petición de resetear su contraseña, por favor ignore este email (su contraseña no será cambiada).<br/><br/><br/>' +
          'Atentamente, <br />'+
          'Servicio Técnico de www.subexpuesta.com'*/

      };

        mailer.sendMail(email, function(err, respuesta) {
            if (err) { 
                console.log(err);
                return handleError(res, err);
            }
            done(err, 'done');
        });

      }
      ], function(err){
        if(err) return next(err);
        return res.json(200);
      });
 };

 /*
  * Reset password
  */
exports.resetPassword = function(req, res){
  console.log('resetPassword: '+req.params.token);
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          //console.log('Token invalido o ha expirado');
          return res.send(500, 'Password reset token is invalid or has expired.');       
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          if (err) return validationError(res, err);          
          res.send(200);
        });

      });
};

/**
 * Change a users password
 */
exports.actualizarDatos = function(req, res, next) {
  
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
