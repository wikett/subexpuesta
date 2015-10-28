'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var async = require('async');
var _ = require('lodash');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
    auth: {
        api_user: 'wikett',
        api_key: 'poiuasdf77'
    }
}



var validationError = function(res, err) {
    return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
    User.find({}, '-salt -hashedPassword', function(err, users) {
        if (err) return res.send(500, err);
        res.json(200, users);
    });
};

exports.getusuario = function(req, res) {
    console.log('REQ.Apuntes.params: ' + req.params.username);

    User.findOne({
        'username': req.params.username
    }).exec(function(err, usuarios) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the usuarios'
            });
        }
        res.jsonp(usuarios);
    });
};


/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save(function(err, user) {
        if (err) return validationError(res, err);
        var token = jwt.sign({
            _id: user._id
        }, config.secrets.session, {
            expiresInMinutes: 60 * 5
        });
        res.json({
            token: token
        });
    });
};


/**
 * Get a single user
 */
exports.show = function(req, res, next) {
    var userId = req.params.id;

    User.findById(userId, function(err, user) {
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
        if (err) return res.send(500, err);
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
    var newUrlFacebook = String(req.body.newUrlFacebook);
    var newUrlTwitter = String(req.body.newUrlTwitter);
    var newAvisoLat = Number(req.body.newAvisoLat);
    var newAvisoLon = Number(req.body.newAvisoLon);
    var newRadioAviso = Number(req.body.newRadioAviso);
    var newFrecuenciaAviso = Number(req.body.newFrecuenciaAviso);

    User.findById(userId, function(err, user) {

        if (user.authenticate(oldPass)) {
            if (newPass !== 'undefined' && newPass.length > 0)
                user.password = newPass;
            if (newName !== 'undefined' && newName.length > 0)
                user.name = newName;
            if (newLocation !== 'undefined' && newLocation.length > 0)
                user.location = newLocation;
            if (newWeb !== 'undefined' && newWeb.length > 0)
                user.web = newWeb;
            if (newUrlFacebook !== 'undefined' && newUrlFacebook.length > 0)
                user.urlFacebook = newUrlFacebook;
            if (newUrlTwitter !== 'undefined' && newUrlTwitter.length > 0)
                user.urlTwitter = newUrlTwitter;
            if (newAvatar !== 'undefined' && newAvatar.length > 0)
                user.avatar = newAvatar;
            if (newRadioAviso > 0)
                user.radioAviso = newRadioAviso;

            user.participarConcursos = newSorteo;
            user.newsletter = newNewsletter;
            user.coordenadasAvisoLatitud = newAvisoLat;
            user.coordenadasAvisoLongitud = newAvisoLon;
            user.frecuenciaAviso = newFrecuenciaAviso;
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
exports.forgottenPassword = function(req, res, next) {
    console.log('Forgotten password: ' + req.body.email);
    async.waterfall([

        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                console.log('Creamos el token: ' + token);
                done(err, token);
            });
        },
        function(token, done) {
            console.log('Buscamos al usuario');
            User.findOne({
                email: req.body.email
            }, function(err, user) {
                if (!user) {
                    return res.send(500, err);
                }

                user.resetPasswordToken = token;
                //user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.resetPasswordExpires = Date.now() + 60000; // 1 minuto

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            console.log('Enviamos mail: req.headers.host ' + req.headers.host);
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
                    'Atentamente, ' +
                    'Servicio Técnico de www.subexpuesta.com'
                /*,
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
    ], function(err) {
        if (err) return next(err);
        return res.json(200);
    });
};

/*
 * Reset password
 */
exports.resetPassword = function(req, res) {
    console.log('resetPassword: ' + req.params.token);
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
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
// add Aviso
exports.addAviso = function(req, res) {

    var query = {
        _id: req.params.id
    };
    var update = req.body;
    var options = {
        new: true
    };
    console.log('req.body: ' + JSON.stringify(req.body));
    User.findOneAndUpdate({
            _id: req.params.id
        }, {
            $push: {
                avisos: req.body
            }
        }, {
            safe: true,
            upsert: true
        },
        function(err, usuario) {
            if (!err) {
                console.log('Aviso anyadido correctamente');
                return res.json(200, usuario);
            } else {
                console.log('Error addAviso  ' + err);
                return handleError(res, err);
            }
        });

};

// Enviar Avisos cada dia
exports.enviarEmailAvisos = function(req, res) { 

    //console.log('enviarEmail!!!!!!!!!!!!!!!: '+req.body.direccion);

    var localizacionesHTML = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns="http://www.w3.org/1999/xhtml"> <head> <!-- NAME: 1:3:1 COLUMN --> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>*|MC:SUBJECT|*</title> <style type="text/css"> p{ margin:1em 0; } a{ word-wrap:break-word; } table{ border-collapse:collapse; } h1,h2,h3,h4,h5,h6{ display:block; margin:0; padding:0; } img,a img{ border:0; height:auto; outline:none; text-decoration:none; } body,#bodyTable,#bodyCell{ height:100% !important; margin:0; padding:0; width:100% !important; } #outlook a{ padding:0; } img{ -ms-interpolation-mode:bicubic; } table{ mso-table-lspace:0pt; mso-table-rspace:0pt; } .ReadMsgBody{ width:100%; } .ExternalClass{ width:100%; } p,a,li,td,blockquote{ mso-line-height-rule:exactly; } a[href^=tel],a[href^=sms]{ color:inherit; cursor:default; text-decoration:none; } p,a,li,td,body,table,blockquote{ -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; } .ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{ line-height:100%; } #bodyCell{ padding-top:20px; padding-right:10px; padding-bottom:20px; padding-left:10px; } .templateContainer{ max-width:600px; } .columnsContainer{ max-width:197px; } a.mcnButton{ display:block; } .mcnImage{ vertical-align:bottom; } .mcnTextContent img{ height:auto !important; } /* @tab Page @section background style @tip Set the background color and top border for your email. You may want to choose colors that match your companys branding. */ body,#bodyTable{ /*@editable*/background-color:#F2F2F2; } /* @tab Page @section background style @tip Set the background color and top border for your email. You may want to choose colors that match your companys branding. */ #bodyCell{ /*@editable*/border-top:0; } /* @tab Page @section email border @tip Set the border for your email. */ .templateContainer{ /*@editable*/border:0; } /* @tab Page @section heading 1 @tip Set the styling for all first-level headings in your emails. These should be the largest of your headings. @style heading 1 */ h1{ /*@editable*/color:#606060 !important; /*@editable*/font-family:Helvetica; /*@editable*/font-size:40px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:-1px; /*@editable*/text-align:left; } /* @tab Page @section heading 2 @tip Set the styling for all second-level headings in your emails. @style heading 2 */ h2{ /*@editable*/color:#404040 !important; ; /*@editable*/ font-family:Helvetica; /*@editable*/font-size:26px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:-.75px; /*@editable*/text-align:left; } /* @tab Page @section heading 3 @tip Set the styling for all third-level headings in your emails. @style heading 3 */ h3{ /*@editable*/color:#606060 !important; /*@editable*/font-family:Helvetica; /*@editable*/font-size:18px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:-.5px; /*@editable*/text-align:left; } /* @tab Page @section heading 4 @tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings. @style heading 4 */ h4{ /*@editable*/color:#808080 !important; /*@editable*/font-family:Helvetica; /*@editable*/font-size:16px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:normal; /*@editable*/text-align:left; } /* @tab Preheader @section preheader style @tip Set the background color and borders for your emails preheader area. */ #templatePreheader{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Preheader @section preheader text @tip Set the styling for your emails preheader text. Choose a size and color that is easy to read. */ .preheaderContainer .mcnTextContent,.preheaderContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:11px; /*@editable*/line-height:125%; /*@editable*/text-align:left; } /* @tab Preheader @section preheader link @tip Set the styling for your emails preheader links. Choose a color that helps them stand out from your text. */ .preheaderContainer .mcnTextContent a{ /*@editable*/color:#606060; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Header @section header style @tip Set the background color and borders for your emails header area. */ #templateHeader{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Header @section header text @tip Set the styling for your emails header text. Choose a size and color that is easy to read. */ .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Header @section header link @tip Set the styling for your emails header links. Choose a color that helps them stand out from your text. */ .headerContainer .mcnTextContent a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Upper Body @section upper body style @tip Set the background color and borders for your emails body area. */ #templateUpperBody{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Upper Body @section upper body text @tip Set the styling for your emails body text. Choose a size and color that is easy to read. */ .upperBodyContainer .mcnTextContent,.upperBodyContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Upper Body @section upper body link @tip Set the styling for your emails body links. Choose a color that helps them stand out from your text. */ .upperBodyContainer .mcnTextContent a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Columns @section column style @tip Set the background color and borders for your emails columns. */ #templateColumns{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Columns @section left column style @tip Set the styling for your emails left column text. Choose a size and color that is easy to read. */ .leftColumnContainer .mcnTextContent,.leftColumnContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Columns @section left column link @tip Set the styling for your emails left column links. Choose a color that helps them stand out from your text. */ .leftColumnContainer .mcnTextContent a,.leftColumnContainer .mcnTextContent p a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Columns @section center column style @tip Set the styling for your emails center column text. Choose a size and color that is easy to read. */ .centerColumnContainer .mcnTextContent,.centerColumnContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Columns @section center column link @tip Set the styling for your emails center column links. Choose a color that helps them stand out from your text. */ .centerColumnContainer .mcnTextContent a,.centerColumnContainer .mcnTextContent p a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Columns @section right column style @tip Set the styling for your emails right column text. Choose a size and color that is easy to read. */ .rightColumnContainer .mcnTextContent,.rightColumnContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Columns @section right column link @tip Set the styling for your emails right column links. Choose a color that helps them stand out from your text. */ .rightColumnContainer .mcnTextContent a,.rightColumnContainer .mcnTextContent p a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Lower Body @section lower body style @tip Set the background color and borders for your emails body area. */ #templateLowerBody{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Lower Body @section lower body text @tip Set the styling for your emails body text. Choose a size and color that is easy to read. */ .lowerBodyContainer .mcnTextContent,.lowerBodyContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Lower Body @section lower body link @tip Set the styling for your emails body links. Choose a color that helps them stand out from your text. */ .lowerBodyContainer .mcnTextContent a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Footer @section footer style @tip Set the background color and borders for your emails footer area. */ #templateFooter{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Footer @section footer text @tip Set the styling for your emails footer text. Choose a size and color that is easy to read. */ .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:11px; /*@editable*/line-height:125%; /*@editable*/text-align:center; } /* @tab Footer @section footer link @tip Set the styling for your emails footer links. Choose a color that helps them stand out from your text. */ .footerContainer .mcnTextContent a{ /*@editable*/color:#606060; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } @media screen and (min-width:768px){ .templateContainer{ width:600px !important; } } @media screen and (min-width:768px){ .columnsContainer{ width:197px !important; } } @media only screen and (max-width:480px){ body{ width:100% !important; min-width:100% !important; } } @media only screen and (max-width:480px){ td#bodyCell{ padding-top:10px !important; } } @media only screen and (max-width:480px){ .columnsContainer{ max-width:100% !important; width:100% !important; } } @media only screen and (max-width:480px){ .columnWidth{ width:100% !important; } } @media only screen and (max-width:480px){ img.mcnImage,table.mcnShareContent,table.mcnCaptionTopContent,table.mcnCaptionBottomContent,table.mcnTextContentContainer,table.mcnBoxedTextContentContainer,table.mcnImageGroupContentContainer,table.mcnCaptionLeftTextContentContainer,table.mcnCaptionRightTextContentContainer,table.mcnCaptionLeftImageContentContainer,table.mcnCaptionRightImageContentContainer,table.mcnImageCardLeftTextContentContainer,table.mcnImageCardRightTextContentContainer{ width:100% !important; } } @media only screen and (max-width:480px){ td.mcnImageGroupContent{ padding:9px !important; } } @media only screen and (max-width:480px){ table.mcnCaptionLeftContentOuter td.mcnTextContent,table.mcnCaptionRightContentOuter td.mcnTextContent{ padding-top:9px !important; } } @media only screen and (max-width:480px){ td.mcnImageCardTopImageContent,td.mcnCaptionBlockInner table.mcnCaptionTopContent:last-child td.mcnTextContent{ padding-top:18px !important; } } @media only screen and (max-width:480px){ td.mcnImageCardBottomImageContent{ padding-bottom:9px !important; } } @media only screen and (max-width:480px){ td.mcnImageGroupBlockInner{ padding-top:0 !important; padding-bottom:0 !important; } } @media only screen and (max-width:480px){ tbody.mcnImageGroupBlockOuter{ padding-top:9px !important; padding-bottom:9px !important; } } @media only screen and (max-width:480px){ td.mcnTextContent,td.mcnBoxedTextContentColumn{ padding-right:18px !important; padding-left:18px !important; } } @media only screen and (max-width:480px){ td.mcnImageCardLeftImageContent,td.mcnImageCardRightImageContent{ padding-right:18px !important; padding-bottom:0 !important; padding-left:18px !important; } } @media only screen and (max-width:480px){ td.columnsContainer{ display:block !important; max-width:600px !important; width:100% !important; } } @media only screen and (max-width:480px){ table.mcpreview-image-uploader{ display:none !important; width:100% !important; } } @media only screen and (max-width:480px){ td.footerContainer a.utilityLink{ display:block !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 1 @tip Make the first-level headings larger in size for better readability on small screens. */ h1{ /*@editable*/font-size:24px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 2 @tip Make the second-level headings larger in size for better readability on small screens. */ h2{ /*@editable*/font-size:20px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 3 @tip Make the third-level headings larger in size for better readability on small screens. */ h3{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 4 @tip Make the fourth-level headings larger in size for better readability on small screens. */ h4{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Boxed Text @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ table.mcnBoxedTextContentContainer td.mcnTextContent,td.mcnBoxedTextContentContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Preheader Visibility @tip Set the visibility of the emails preheader on small screens. You can hide it to save space. */ td#templatePreheader{ /*@editable*/display:block !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Preheader Text @tip Make the preheader text larger in size for better readability on small screens. */ td.preheaderContainer td.mcnTextContent,td.preheaderContainer td.mcnTextContent p{ /*@editable*/font-size:14px !important; /*@editable*/line-height:115% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Header Text @tip Make the header text larger in size for better readability on small screens. */ td.headerContainer td.mcnTextContent,td.headerContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Upper Body Text @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.upperBodyContainer td.mcnTextContent,td.upperBodyContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Left Column Text @tip Make the left column text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.leftColumnContainer td.mcnTextContent,td.leftColumnContainer td.mcnTextContent p{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Center Column Text @tip Make the center column text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.centerColumnContainer td.mcnTextContent,td.centerColumnContainer td.mcnTextContent p{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Right Column Text @tip Make the right column text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.rightColumnContainer td.mcnTextContent,td.rightColumnContainer td.mcnTextContent p{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Lower Body Text @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.lowerBodyContainer td.mcnTextContent,td.lowerBodyContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section footer text @tip Make the body content text larger in size for better readability on small screens. */ td.footerContainer td.mcnTextContent,td.footerContainer td.mcnTextContent p{ /*@editable*/font-size:14px !important; /*@editable*/line-height:115% !important; } }</style></head> <body> <center> <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable"> <tr> <td align="center" valign="top" id="bodyCell"> <!--[if gte mso 9]> <table align="center" border="0" cellspacing="0" cellpadding="0" style="width:600px;" width="600"> <tr> <td align="center" valign="top"> <![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer"> <tr> <td align="center" valign="top" id="templatePreheader"> <!-- BEGIN PREHEADER // --> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="preheaderContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="366" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-left:18px; padding-bottom:9px; padding-right:0;"> Localizaciones nocturnas cerca de ti </td> </tr> </tbody></table> <table align="right" border="0" cellpadding="0" cellspacing="0" width="197" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right:18px; padding-bottom:9px; padding-left:0;"> <a href="*|ARCHIVE|*" target="_blank">View this email in your browser</a> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END PREHEADER --> </td> </tr> <tr> <td align="center" valign="top" id="templateHeader"> <!-- BEGIN HEADER // --> <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock"> <tbody class="mcnImageBlockOuter"> <tr> <td valign="top" style="padding:9px" class="mcnImageBlockInner"> <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer"> <tbody><tr> <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0;"> <img align="left" alt="" src="https://gallery.mailchimp.com/200f5dddbe9112ab8d21e9c28/images/8775d11f-8bf4-4b54-a7de-3bc208affbc9.jpg" width="500" style="max-width:500px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage"> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END HEADER --> </td> </tr> <tr> <td align="center" valign="top" id="templateUpperBody"> <!-- BEGIN UPPER BODY // --> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="upperBodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right: 18px; padding-bottom: 9px; padding-left: 18px;"> <h1>Querido amante nocturno</h1> <h3>De las fotografías</h3> <p>Aquí tienes las localizaciones más recientes cerca de tu área. Recuerda que en cualquier momento puedes cambiar la configuración de tus Avisos dentro del panel de configuración de tu perfil en <a href="http://www.subexpuesta.com/" target="_blank">www.subexpuesta.com</a></p> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END UPPER BODY --> </td> </tr> <tr> <!-- BEGIN COLUMNS // --> <td align="center" valign="top" id="templateColumns"> <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">';
    var estiloLocalizacion = 'leftColumnContainer';
    User.find({}, '-salt -hashedPassword', function(err, users) {
        if (err) return res.send(500, err);

        for (var i = 0; i < users.length; i++) {
            //console.log('username: ' + users[i].username);
            if (users[i].avisos.length > 0) {
              if(users[i].frecuenciaAviso==1){
                //console.log('Total de avisos para el usuario: ' + users[i].username + ' son de: ' + users[i].avisos.length +' frecuenciaAviso: '+users[i].frecuenciaAviso);
                var numavisos = 0;
                while (numavisos < users[i].avisos.length) {

                    localizacionesHTML += '<tr><td align="center" style="text-align:center; display:inline-block;" valign="top">'
                    localizacionesHTML += '<!-- BEGIN INDIVIDUAL COLUMNS // --><!--[if gte mso 9]><table align="center" border="0" cellspacing="0" cellpadding="0" style="width:600px;" width="600"><tr>';

                    for (var contador = 0; contador < 3 && numavisos < users[i].avisos.length; contador++) {
                        //console.log('AVISO: ' + numavisos + ' titulo: ' + users[i].avisos[numavisos].titulo);
                        localizacionesHTML += '<td align="center" valign="top" style="width:197px;" width="197"><![endif]-->';
                        if (contador == 0) {
                            estiloLocalizacion = 'leftColumnContainer';
                        } else {
                            if (contador == 1) {
                                estiloLocalizacion = 'centerColumnContainer';
                            } else {
                                estiloLocalizacion = 'rightColumnContainer';
                            }
                        }

                        localizacionesHTML += '<div style="display:inline-block; vertical-align:top; width:197px;" class="columnWidth"><table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="columnsContainer"><tr><td valign="top" class="' + estiloLocalizacion + '"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnCaptionBlock"><tbody class="mcnCaptionBlockOuter"><tr><td class="mcnCaptionBlockInner" valign="top" style="padding:9px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="mcnCaptionBottomContent" width="false"><tbody><tr><td class="mcnCaptionBottomImageContent" align="left" valign="top" style="padding:0 9px 9px 9px;">';
                        localizacionesHTML += '<a href="' + users[i].avisos[numavisos].url + '" title="" class="" target="_blank">';
                        localizacionesHTML += '<img alt="" src="' + users[i].avisos[numavisos].imagen + '" width="161" style="max-width:340px;" class="mcnImage">';
                        localizacionesHTML += '</a></td></tr><tr><td class="mcnTextContent" valign="top" style="padding:0 9px 0 9px;" width="161">' + users[i].avisos[numavisos].titulo + ' por ' + users[i].avisos[numavisos].autor + '. Está a una distancia de ' + users[i].avisos[numavisos].distanciakm + 'km.</td></tr></tbody></table></td></tr></tbody></table></td></tr></table></div>';
                        localizacionesHTML += '<!--[if gte mso 9]></td>';
                        numavisos++;
                    }

                    localizacionesHTML += '<!--[if gte mso 9]></td></tr></table><![endif]-->';
                    localizacionesHTML += '</td></tr>';
                }

                localizacionesHTML += '</table> </td> <!-- // END COLUMNS --> </tr> <tr> <td align="center" valign="top" id="templateLowerBody"> <!-- BEGIN LOWER BODY // --> <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="lowerBodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"> <tbody class="mcnDividerBlockOuter"> <tr> <td class="mcnDividerBlockInner" style="padding: 18px;"> <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top-width: 1px;border-top-style: solid;border-top-color: #999999;"> <tbody><tr> <td> <span></span> </td> </tr> </tbody></table> </td> </tr> </tbody> </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right: 18px; padding-bottom: 9px; padding-left: 18px;"> <p>Esperemos que te guste todas estas localizaciones y si te animas a fotografiar estas localizaciones u otras que tengas en mente, no te olvides de colaborar con nosotros aportando tu localización para el resto de fotógrafos nocturnos.<br> <br> <em style="line-height:20.7999992370605px">Un saludo afectuoso&nbsp;<a href="http://www.subexpuesta.com/" target="_blank">www.subexpuesta.com</a></em></p> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END LOWER BODY --> </td> </tr> <tr> <td align="center" valign="top" id="templateFooter"> <!-- BEGIN FOOTER // --> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="footerContainer"></td> </tr> </table> <!-- // END FOOTER --> </td> </tr> </table> <!--[if gte mso 9]> </td> </tr> </table> <![endif]--> </td> </tr> </table> </center> </body> </html>';
                //console.log(localizacionesHTML);
                
                var mailer = nodemailer.createTransport(sgTransport(options));
                var email = {
                    to: users[i].email,
                    from: 'subexpuestaweb@gmail.com',
                    subject: 'Localizaciones nocturnas cerca de ti!',
                    html: localizacionesHTML
                };

                mailer.sendMail(email, function(err, respuesta) {
                    if (err) {
                        console.log(err);
                        return handleError(res, err);
                    }
                    //return res.json(200, respuesta);

                });

                User.findOneAndUpdate({
                        _id: users[i]._id
                    }, {
                        $set: {
                            avisos: []
                        }
                    }, {
                        safe: true,
                        upsert: true
                    },
                    function(err, usuario) {
                        if (!err) {
                            console.log('Avisos quitados correctamente');
                            //return res.json(200, usuario);
                        } else {
                            console.log('Error removeAvisos  ' + err);
                            return handleError(res, err);
                        }
                    });
              }
            } //Fin usuario con avisos

        }


    });
    return res.json(200);



};


// Enviar Avisos cada semana
exports.enviarEmailAvisosSemanal = function(req, res) { 

    //console.log('enviarEmail!!!!!!!!!!!!!!!: '+req.body.direccion);

    var localizacionesHTML = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns="http://www.w3.org/1999/xhtml"> <head> <!-- NAME: 1:3:1 COLUMN --> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>*|MC:SUBJECT|*</title> <style type="text/css"> p{ margin:1em 0; } a{ word-wrap:break-word; } table{ border-collapse:collapse; } h1,h2,h3,h4,h5,h6{ display:block; margin:0; padding:0; } img,a img{ border:0; height:auto; outline:none; text-decoration:none; } body,#bodyTable,#bodyCell{ height:100% !important; margin:0; padding:0; width:100% !important; } #outlook a{ padding:0; } img{ -ms-interpolation-mode:bicubic; } table{ mso-table-lspace:0pt; mso-table-rspace:0pt; } .ReadMsgBody{ width:100%; } .ExternalClass{ width:100%; } p,a,li,td,blockquote{ mso-line-height-rule:exactly; } a[href^=tel],a[href^=sms]{ color:inherit; cursor:default; text-decoration:none; } p,a,li,td,body,table,blockquote{ -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; } .ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{ line-height:100%; } #bodyCell{ padding-top:20px; padding-right:10px; padding-bottom:20px; padding-left:10px; } .templateContainer{ max-width:600px; } .columnsContainer{ max-width:197px; } a.mcnButton{ display:block; } .mcnImage{ vertical-align:bottom; } .mcnTextContent img{ height:auto !important; } /* @tab Page @section background style @tip Set the background color and top border for your email. You may want to choose colors that match your companys branding. */ body,#bodyTable{ /*@editable*/background-color:#F2F2F2; } /* @tab Page @section background style @tip Set the background color and top border for your email. You may want to choose colors that match your companys branding. */ #bodyCell{ /*@editable*/border-top:0; } /* @tab Page @section email border @tip Set the border for your email. */ .templateContainer{ /*@editable*/border:0; } /* @tab Page @section heading 1 @tip Set the styling for all first-level headings in your emails. These should be the largest of your headings. @style heading 1 */ h1{ /*@editable*/color:#606060 !important; /*@editable*/font-family:Helvetica; /*@editable*/font-size:40px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:-1px; /*@editable*/text-align:left; } /* @tab Page @section heading 2 @tip Set the styling for all second-level headings in your emails. @style heading 2 */ h2{ /*@editable*/color:#404040 !important; ; /*@editable*/ font-family:Helvetica; /*@editable*/font-size:26px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:-.75px; /*@editable*/text-align:left; } /* @tab Page @section heading 3 @tip Set the styling for all third-level headings in your emails. @style heading 3 */ h3{ /*@editable*/color:#606060 !important; /*@editable*/font-family:Helvetica; /*@editable*/font-size:18px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:-.5px; /*@editable*/text-align:left; } /* @tab Page @section heading 4 @tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings. @style heading 4 */ h4{ /*@editable*/color:#808080 !important; /*@editable*/font-family:Helvetica; /*@editable*/font-size:16px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:normal; /*@editable*/text-align:left; } /* @tab Preheader @section preheader style @tip Set the background color and borders for your emails preheader area. */ #templatePreheader{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Preheader @section preheader text @tip Set the styling for your emails preheader text. Choose a size and color that is easy to read. */ .preheaderContainer .mcnTextContent,.preheaderContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:11px; /*@editable*/line-height:125%; /*@editable*/text-align:left; } /* @tab Preheader @section preheader link @tip Set the styling for your emails preheader links. Choose a color that helps them stand out from your text. */ .preheaderContainer .mcnTextContent a{ /*@editable*/color:#606060; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Header @section header style @tip Set the background color and borders for your emails header area. */ #templateHeader{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Header @section header text @tip Set the styling for your emails header text. Choose a size and color that is easy to read. */ .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Header @section header link @tip Set the styling for your emails header links. Choose a color that helps them stand out from your text. */ .headerContainer .mcnTextContent a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Upper Body @section upper body style @tip Set the background color and borders for your emails body area. */ #templateUpperBody{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Upper Body @section upper body text @tip Set the styling for your emails body text. Choose a size and color that is easy to read. */ .upperBodyContainer .mcnTextContent,.upperBodyContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Upper Body @section upper body link @tip Set the styling for your emails body links. Choose a color that helps them stand out from your text. */ .upperBodyContainer .mcnTextContent a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Columns @section column style @tip Set the background color and borders for your emails columns. */ #templateColumns{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Columns @section left column style @tip Set the styling for your emails left column text. Choose a size and color that is easy to read. */ .leftColumnContainer .mcnTextContent,.leftColumnContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Columns @section left column link @tip Set the styling for your emails left column links. Choose a color that helps them stand out from your text. */ .leftColumnContainer .mcnTextContent a,.leftColumnContainer .mcnTextContent p a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Columns @section center column style @tip Set the styling for your emails center column text. Choose a size and color that is easy to read. */ .centerColumnContainer .mcnTextContent,.centerColumnContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Columns @section center column link @tip Set the styling for your emails center column links. Choose a color that helps them stand out from your text. */ .centerColumnContainer .mcnTextContent a,.centerColumnContainer .mcnTextContent p a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Columns @section right column style @tip Set the styling for your emails right column text. Choose a size and color that is easy to read. */ .rightColumnContainer .mcnTextContent,.rightColumnContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Columns @section right column link @tip Set the styling for your emails right column links. Choose a color that helps them stand out from your text. */ .rightColumnContainer .mcnTextContent a,.rightColumnContainer .mcnTextContent p a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Lower Body @section lower body style @tip Set the background color and borders for your emails body area. */ #templateLowerBody{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Lower Body @section lower body text @tip Set the styling for your emails body text. Choose a size and color that is easy to read. */ .lowerBodyContainer .mcnTextContent,.lowerBodyContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Lower Body @section lower body link @tip Set the styling for your emails body links. Choose a color that helps them stand out from your text. */ .lowerBodyContainer .mcnTextContent a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Footer @section footer style @tip Set the background color and borders for your emails footer area. */ #templateFooter{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Footer @section footer text @tip Set the styling for your emails footer text. Choose a size and color that is easy to read. */ .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:11px; /*@editable*/line-height:125%; /*@editable*/text-align:center; } /* @tab Footer @section footer link @tip Set the styling for your emails footer links. Choose a color that helps them stand out from your text. */ .footerContainer .mcnTextContent a{ /*@editable*/color:#606060; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } @media screen and (min-width:768px){ .templateContainer{ width:600px !important; } } @media screen and (min-width:768px){ .columnsContainer{ width:197px !important; } } @media only screen and (max-width:480px){ body{ width:100% !important; min-width:100% !important; } } @media only screen and (max-width:480px){ td#bodyCell{ padding-top:10px !important; } } @media only screen and (max-width:480px){ .columnsContainer{ max-width:100% !important; width:100% !important; } } @media only screen and (max-width:480px){ .columnWidth{ width:100% !important; } } @media only screen and (max-width:480px){ img.mcnImage,table.mcnShareContent,table.mcnCaptionTopContent,table.mcnCaptionBottomContent,table.mcnTextContentContainer,table.mcnBoxedTextContentContainer,table.mcnImageGroupContentContainer,table.mcnCaptionLeftTextContentContainer,table.mcnCaptionRightTextContentContainer,table.mcnCaptionLeftImageContentContainer,table.mcnCaptionRightImageContentContainer,table.mcnImageCardLeftTextContentContainer,table.mcnImageCardRightTextContentContainer{ width:100% !important; } } @media only screen and (max-width:480px){ td.mcnImageGroupContent{ padding:9px !important; } } @media only screen and (max-width:480px){ table.mcnCaptionLeftContentOuter td.mcnTextContent,table.mcnCaptionRightContentOuter td.mcnTextContent{ padding-top:9px !important; } } @media only screen and (max-width:480px){ td.mcnImageCardTopImageContent,td.mcnCaptionBlockInner table.mcnCaptionTopContent:last-child td.mcnTextContent{ padding-top:18px !important; } } @media only screen and (max-width:480px){ td.mcnImageCardBottomImageContent{ padding-bottom:9px !important; } } @media only screen and (max-width:480px){ td.mcnImageGroupBlockInner{ padding-top:0 !important; padding-bottom:0 !important; } } @media only screen and (max-width:480px){ tbody.mcnImageGroupBlockOuter{ padding-top:9px !important; padding-bottom:9px !important; } } @media only screen and (max-width:480px){ td.mcnTextContent,td.mcnBoxedTextContentColumn{ padding-right:18px !important; padding-left:18px !important; } } @media only screen and (max-width:480px){ td.mcnImageCardLeftImageContent,td.mcnImageCardRightImageContent{ padding-right:18px !important; padding-bottom:0 !important; padding-left:18px !important; } } @media only screen and (max-width:480px){ td.columnsContainer{ display:block !important; max-width:600px !important; width:100% !important; } } @media only screen and (max-width:480px){ table.mcpreview-image-uploader{ display:none !important; width:100% !important; } } @media only screen and (max-width:480px){ td.footerContainer a.utilityLink{ display:block !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 1 @tip Make the first-level headings larger in size for better readability on small screens. */ h1{ /*@editable*/font-size:24px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 2 @tip Make the second-level headings larger in size for better readability on small screens. */ h2{ /*@editable*/font-size:20px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 3 @tip Make the third-level headings larger in size for better readability on small screens. */ h3{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 4 @tip Make the fourth-level headings larger in size for better readability on small screens. */ h4{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Boxed Text @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ table.mcnBoxedTextContentContainer td.mcnTextContent,td.mcnBoxedTextContentContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Preheader Visibility @tip Set the visibility of the emails preheader on small screens. You can hide it to save space. */ td#templatePreheader{ /*@editable*/display:block !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Preheader Text @tip Make the preheader text larger in size for better readability on small screens. */ td.preheaderContainer td.mcnTextContent,td.preheaderContainer td.mcnTextContent p{ /*@editable*/font-size:14px !important; /*@editable*/line-height:115% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Header Text @tip Make the header text larger in size for better readability on small screens. */ td.headerContainer td.mcnTextContent,td.headerContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Upper Body Text @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.upperBodyContainer td.mcnTextContent,td.upperBodyContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Left Column Text @tip Make the left column text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.leftColumnContainer td.mcnTextContent,td.leftColumnContainer td.mcnTextContent p{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Center Column Text @tip Make the center column text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.centerColumnContainer td.mcnTextContent,td.centerColumnContainer td.mcnTextContent p{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Right Column Text @tip Make the right column text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.rightColumnContainer td.mcnTextContent,td.rightColumnContainer td.mcnTextContent p{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Lower Body Text @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.lowerBodyContainer td.mcnTextContent,td.lowerBodyContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section footer text @tip Make the body content text larger in size for better readability on small screens. */ td.footerContainer td.mcnTextContent,td.footerContainer td.mcnTextContent p{ /*@editable*/font-size:14px !important; /*@editable*/line-height:115% !important; } }</style></head> <body> <center> <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable"> <tr> <td align="center" valign="top" id="bodyCell"> <!--[if gte mso 9]> <table align="center" border="0" cellspacing="0" cellpadding="0" style="width:600px;" width="600"> <tr> <td align="center" valign="top"> <![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer"> <tr> <td align="center" valign="top" id="templatePreheader"> <!-- BEGIN PREHEADER // --> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="preheaderContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="366" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-left:18px; padding-bottom:9px; padding-right:0;"> Localizaciones nocturnas cerca de ti </td> </tr> </tbody></table> <table align="right" border="0" cellpadding="0" cellspacing="0" width="197" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right:18px; padding-bottom:9px; padding-left:0;"> <a href="*|ARCHIVE|*" target="_blank">View this email in your browser</a> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END PREHEADER --> </td> </tr> <tr> <td align="center" valign="top" id="templateHeader"> <!-- BEGIN HEADER // --> <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock"> <tbody class="mcnImageBlockOuter"> <tr> <td valign="top" style="padding:9px" class="mcnImageBlockInner"> <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer"> <tbody><tr> <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0;"> <img align="left" alt="" src="https://gallery.mailchimp.com/200f5dddbe9112ab8d21e9c28/images/8775d11f-8bf4-4b54-a7de-3bc208affbc9.jpg" width="500" style="max-width:500px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage"> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END HEADER --> </td> </tr> <tr> <td align="center" valign="top" id="templateUpperBody"> <!-- BEGIN UPPER BODY // --> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="upperBodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right: 18px; padding-bottom: 9px; padding-left: 18px;"> <h1>Querido amante nocturno</h1> <h3>De las fotografías</h3> <p>Aquí tienes las localizaciones más recientes cerca de tu área. Recuerda que en cualquier momento puedes cambiar la configuración de tus Avisos dentro del panel de configuración de tu perfil en <a href="http://www.subexpuesta.com/" target="_blank">www.subexpuesta.com</a></p> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END UPPER BODY --> </td> </tr> <tr> <!-- BEGIN COLUMNS // --> <td align="center" valign="top" id="templateColumns"> <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">';
    var estiloLocalizacion = 'leftColumnContainer';
    User.find({}, '-salt -hashedPassword', function(err, users) {
        if (err) return res.send(500, err);

        for (var i = 0; i < users.length; i++) {
            //console.log('username: ' + users[i].username);
            if (users[i].avisos.length > 0) {
              if(users[i].frecuenciaAviso==2){
                //console.log('Total de avisos para el usuario: ' + users[i].username + ' son de: ' + users[i].avisos.length +' frecuenciaAviso: '+users[i].frecuenciaAviso);
                var numavisos = 0;
                while (numavisos < users[i].avisos.length) {

                    localizacionesHTML += '<tr><td align="center" style="text-align:center; display:inline-block;" valign="top">'
                    localizacionesHTML += '<!-- BEGIN INDIVIDUAL COLUMNS // --><!--[if gte mso 9]><table align="center" border="0" cellspacing="0" cellpadding="0" style="width:600px;" width="600"><tr>';

                    for (var contador = 0; contador < 3 && numavisos < users[i].avisos.length; contador++) {
                        console.log('AVISO: ' + numavisos + ' titulo: ' + users[i].avisos[numavisos].titulo);
                        localizacionesHTML += '<td align="center" valign="top" style="width:197px;" width="197"><![endif]-->';
                        if (contador == 0) {
                            estiloLocalizacion = 'leftColumnContainer';
                        } else {
                            if (contador == 1) {
                                estiloLocalizacion = 'centerColumnContainer';
                            } else {
                                estiloLocalizacion = 'rightColumnContainer';
                            }
                        }

                        localizacionesHTML += '<div style="display:inline-block; vertical-align:top; width:197px;" class="columnWidth"><table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="columnsContainer"><tr><td valign="top" class="' + estiloLocalizacion + '"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnCaptionBlock"><tbody class="mcnCaptionBlockOuter"><tr><td class="mcnCaptionBlockInner" valign="top" style="padding:9px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="mcnCaptionBottomContent" width="false"><tbody><tr><td class="mcnCaptionBottomImageContent" align="left" valign="top" style="padding:0 9px 9px 9px;">';
                        localizacionesHTML += '<a href="' + users[i].avisos[numavisos].url + '" title="" class="" target="_blank">';
                        localizacionesHTML += '<img alt="" src="' + users[i].avisos[numavisos].imagen + '" width="161" style="max-width:340px;" class="mcnImage">';
                        localizacionesHTML += '</a></td></tr><tr><td class="mcnTextContent" valign="top" style="padding:0 9px 0 9px;" width="161">' + users[i].avisos[numavisos].titulo + ' por ' + users[i].avisos[numavisos].autor + '. Está a una distancia de ' + users[i].avisos[numavisos].distanciakm + 'km.</td></tr></tbody></table></td></tr></tbody></table></td></tr></table></div>';
                        localizacionesHTML += '<!--[if gte mso 9]></td>';
                        numavisos++;
                    }

                    localizacionesHTML += '<!--[if gte mso 9]></td></tr></table><![endif]-->';
                    localizacionesHTML += '</td></tr>';
                }

                localizacionesHTML += '</table> </td> <!-- // END COLUMNS --> </tr> <tr> <td align="center" valign="top" id="templateLowerBody"> <!-- BEGIN LOWER BODY // --> <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="lowerBodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"> <tbody class="mcnDividerBlockOuter"> <tr> <td class="mcnDividerBlockInner" style="padding: 18px;"> <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top-width: 1px;border-top-style: solid;border-top-color: #999999;"> <tbody><tr> <td> <span></span> </td> </tr> </tbody></table> </td> </tr> </tbody> </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right: 18px; padding-bottom: 9px; padding-left: 18px;"> <p>Esperemos que te guste todas estas localizaciones y si te animas a fotografiar estas localizaciones u otras que tengas en mente, no te olvides de colaborar con nosotros aportando tu localización para el resto de fotógrafos nocturnos.<br> <br> <em style="line-height:20.7999992370605px">Un saludo afectuoso&nbsp;<a href="http://www.subexpuesta.com/" target="_blank">www.subexpuesta.com</a></em></p> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END LOWER BODY --> </td> </tr> <tr> <td align="center" valign="top" id="templateFooter"> <!-- BEGIN FOOTER // --> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="footerContainer"></td> </tr> </table> <!-- // END FOOTER --> </td> </tr> </table> <!--[if gte mso 9]> </td> </tr> </table> <![endif]--> </td> </tr> </table> </center> </body> </html>';
                //console.log(localizacionesHTML);
                
                var mailer = nodemailer.createTransport(sgTransport(options));
                var email = {
                    to: users[i].email,
                    from: 'subexpuestaweb@gmail.com',
                    subject: 'Localizaciones nocturnas cerca de ti!',
                    html: localizacionesHTML
                };

                mailer.sendMail(email, function(err, respuesta) {
                    if (err) {
                        console.log(err);
                        return handleError(res, err);
                    }
                    //return res.json(200, respuesta);

                });

                User.findOneAndUpdate({
                        _id: users[i]._id
                    }, {
                        $set: {
                            avisos: []
                        }
                    }, {
                        safe: true,
                        upsert: true
                    },
                    function(err, usuario) {
                        if (!err) {
                            console.log('Avisos quitados correctamente');
                            //return res.json(200, usuario);
                        } else {
                            console.log('Error removeAvisos  ' + err);
                            return handleError(res, err);
                        }
                    });
              }
            } //Fin usuario con avisos

        }


    });
    return res.json(200);



};
// Enviar Avisos cada mes
exports.enviarEmailAvisosMensual = function(req, res) { 

    //console.log('enviarEmail!!!!!!!!!!!!!!!: '+req.body.direccion);

    var localizacionesHTML = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns="http://www.w3.org/1999/xhtml"> <head> <!-- NAME: 1:3:1 COLUMN --> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>*|MC:SUBJECT|*</title> <style type="text/css"> p{ margin:1em 0; } a{ word-wrap:break-word; } table{ border-collapse:collapse; } h1,h2,h3,h4,h5,h6{ display:block; margin:0; padding:0; } img,a img{ border:0; height:auto; outline:none; text-decoration:none; } body,#bodyTable,#bodyCell{ height:100% !important; margin:0; padding:0; width:100% !important; } #outlook a{ padding:0; } img{ -ms-interpolation-mode:bicubic; } table{ mso-table-lspace:0pt; mso-table-rspace:0pt; } .ReadMsgBody{ width:100%; } .ExternalClass{ width:100%; } p,a,li,td,blockquote{ mso-line-height-rule:exactly; } a[href^=tel],a[href^=sms]{ color:inherit; cursor:default; text-decoration:none; } p,a,li,td,body,table,blockquote{ -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; } .ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{ line-height:100%; } #bodyCell{ padding-top:20px; padding-right:10px; padding-bottom:20px; padding-left:10px; } .templateContainer{ max-width:600px; } .columnsContainer{ max-width:197px; } a.mcnButton{ display:block; } .mcnImage{ vertical-align:bottom; } .mcnTextContent img{ height:auto !important; } /* @tab Page @section background style @tip Set the background color and top border for your email. You may want to choose colors that match your companys branding. */ body,#bodyTable{ /*@editable*/background-color:#F2F2F2; } /* @tab Page @section background style @tip Set the background color and top border for your email. You may want to choose colors that match your companys branding. */ #bodyCell{ /*@editable*/border-top:0; } /* @tab Page @section email border @tip Set the border for your email. */ .templateContainer{ /*@editable*/border:0; } /* @tab Page @section heading 1 @tip Set the styling for all first-level headings in your emails. These should be the largest of your headings. @style heading 1 */ h1{ /*@editable*/color:#606060 !important; /*@editable*/font-family:Helvetica; /*@editable*/font-size:40px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:-1px; /*@editable*/text-align:left; } /* @tab Page @section heading 2 @tip Set the styling for all second-level headings in your emails. @style heading 2 */ h2{ /*@editable*/color:#404040 !important; ; /*@editable*/ font-family:Helvetica; /*@editable*/font-size:26px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:-.75px; /*@editable*/text-align:left; } /* @tab Page @section heading 3 @tip Set the styling for all third-level headings in your emails. @style heading 3 */ h3{ /*@editable*/color:#606060 !important; /*@editable*/font-family:Helvetica; /*@editable*/font-size:18px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:-.5px; /*@editable*/text-align:left; } /* @tab Page @section heading 4 @tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings. @style heading 4 */ h4{ /*@editable*/color:#808080 !important; /*@editable*/font-family:Helvetica; /*@editable*/font-size:16px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:125%; /*@editable*/letter-spacing:normal; /*@editable*/text-align:left; } /* @tab Preheader @section preheader style @tip Set the background color and borders for your emails preheader area. */ #templatePreheader{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Preheader @section preheader text @tip Set the styling for your emails preheader text. Choose a size and color that is easy to read. */ .preheaderContainer .mcnTextContent,.preheaderContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:11px; /*@editable*/line-height:125%; /*@editable*/text-align:left; } /* @tab Preheader @section preheader link @tip Set the styling for your emails preheader links. Choose a color that helps them stand out from your text. */ .preheaderContainer .mcnTextContent a{ /*@editable*/color:#606060; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Header @section header style @tip Set the background color and borders for your emails header area. */ #templateHeader{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Header @section header text @tip Set the styling for your emails header text. Choose a size and color that is easy to read. */ .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Header @section header link @tip Set the styling for your emails header links. Choose a color that helps them stand out from your text. */ .headerContainer .mcnTextContent a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Upper Body @section upper body style @tip Set the background color and borders for your emails body area. */ #templateUpperBody{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Upper Body @section upper body text @tip Set the styling for your emails body text. Choose a size and color that is easy to read. */ .upperBodyContainer .mcnTextContent,.upperBodyContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Upper Body @section upper body link @tip Set the styling for your emails body links. Choose a color that helps them stand out from your text. */ .upperBodyContainer .mcnTextContent a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Columns @section column style @tip Set the background color and borders for your emails columns. */ #templateColumns{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Columns @section left column style @tip Set the styling for your emails left column text. Choose a size and color that is easy to read. */ .leftColumnContainer .mcnTextContent,.leftColumnContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Columns @section left column link @tip Set the styling for your emails left column links. Choose a color that helps them stand out from your text. */ .leftColumnContainer .mcnTextContent a,.leftColumnContainer .mcnTextContent p a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Columns @section center column style @tip Set the styling for your emails center column text. Choose a size and color that is easy to read. */ .centerColumnContainer .mcnTextContent,.centerColumnContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Columns @section center column link @tip Set the styling for your emails center column links. Choose a color that helps them stand out from your text. */ .centerColumnContainer .mcnTextContent a,.centerColumnContainer .mcnTextContent p a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Columns @section right column style @tip Set the styling for your emails right column text. Choose a size and color that is easy to read. */ .rightColumnContainer .mcnTextContent,.rightColumnContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Columns @section right column link @tip Set the styling for your emails right column links. Choose a color that helps them stand out from your text. */ .rightColumnContainer .mcnTextContent a,.rightColumnContainer .mcnTextContent p a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Lower Body @section lower body style @tip Set the background color and borders for your emails body area. */ #templateLowerBody{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Lower Body @section lower body text @tip Set the styling for your emails body text. Choose a size and color that is easy to read. */ .lowerBodyContainer .mcnTextContent,.lowerBodyContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:15px; /*@editable*/line-height:150%; /*@editable*/text-align:left; } /* @tab Lower Body @section lower body link @tip Set the styling for your emails body links. Choose a color that helps them stand out from your text. */ .lowerBodyContainer .mcnTextContent a{ /*@editable*/color:#6DC6DD; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } /* @tab Footer @section footer style @tip Set the background color and borders for your emails footer area. */ #templateFooter{ /*@editable*/background-color:#FFFFFF; /*@editable*/border-top:0; /*@editable*/border-bottom:0; } /* @tab Footer @section footer text @tip Set the styling for your emails footer text. Choose a size and color that is easy to read. */ .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{ /*@editable*/color:#606060; /*@editable*/font-family:Helvetica; /*@editable*/font-size:11px; /*@editable*/line-height:125%; /*@editable*/text-align:center; } /* @tab Footer @section footer link @tip Set the styling for your emails footer links. Choose a color that helps them stand out from your text. */ .footerContainer .mcnTextContent a{ /*@editable*/color:#606060; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline; } @media screen and (min-width:768px){ .templateContainer{ width:600px !important; } } @media screen and (min-width:768px){ .columnsContainer{ width:197px !important; } } @media only screen and (max-width:480px){ body{ width:100% !important; min-width:100% !important; } } @media only screen and (max-width:480px){ td#bodyCell{ padding-top:10px !important; } } @media only screen and (max-width:480px){ .columnsContainer{ max-width:100% !important; width:100% !important; } } @media only screen and (max-width:480px){ .columnWidth{ width:100% !important; } } @media only screen and (max-width:480px){ img.mcnImage,table.mcnShareContent,table.mcnCaptionTopContent,table.mcnCaptionBottomContent,table.mcnTextContentContainer,table.mcnBoxedTextContentContainer,table.mcnImageGroupContentContainer,table.mcnCaptionLeftTextContentContainer,table.mcnCaptionRightTextContentContainer,table.mcnCaptionLeftImageContentContainer,table.mcnCaptionRightImageContentContainer,table.mcnImageCardLeftTextContentContainer,table.mcnImageCardRightTextContentContainer{ width:100% !important; } } @media only screen and (max-width:480px){ td.mcnImageGroupContent{ padding:9px !important; } } @media only screen and (max-width:480px){ table.mcnCaptionLeftContentOuter td.mcnTextContent,table.mcnCaptionRightContentOuter td.mcnTextContent{ padding-top:9px !important; } } @media only screen and (max-width:480px){ td.mcnImageCardTopImageContent,td.mcnCaptionBlockInner table.mcnCaptionTopContent:last-child td.mcnTextContent{ padding-top:18px !important; } } @media only screen and (max-width:480px){ td.mcnImageCardBottomImageContent{ padding-bottom:9px !important; } } @media only screen and (max-width:480px){ td.mcnImageGroupBlockInner{ padding-top:0 !important; padding-bottom:0 !important; } } @media only screen and (max-width:480px){ tbody.mcnImageGroupBlockOuter{ padding-top:9px !important; padding-bottom:9px !important; } } @media only screen and (max-width:480px){ td.mcnTextContent,td.mcnBoxedTextContentColumn{ padding-right:18px !important; padding-left:18px !important; } } @media only screen and (max-width:480px){ td.mcnImageCardLeftImageContent,td.mcnImageCardRightImageContent{ padding-right:18px !important; padding-bottom:0 !important; padding-left:18px !important; } } @media only screen and (max-width:480px){ td.columnsContainer{ display:block !important; max-width:600px !important; width:100% !important; } } @media only screen and (max-width:480px){ table.mcpreview-image-uploader{ display:none !important; width:100% !important; } } @media only screen and (max-width:480px){ td.footerContainer a.utilityLink{ display:block !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 1 @tip Make the first-level headings larger in size for better readability on small screens. */ h1{ /*@editable*/font-size:24px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 2 @tip Make the second-level headings larger in size for better readability on small screens. */ h2{ /*@editable*/font-size:20px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 3 @tip Make the third-level headings larger in size for better readability on small screens. */ h3{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section heading 4 @tip Make the fourth-level headings larger in size for better readability on small screens. */ h4{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Boxed Text @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ table.mcnBoxedTextContentContainer td.mcnTextContent,td.mcnBoxedTextContentContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Preheader Visibility @tip Set the visibility of the emails preheader on small screens. You can hide it to save space. */ td#templatePreheader{ /*@editable*/display:block !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Preheader Text @tip Make the preheader text larger in size for better readability on small screens. */ td.preheaderContainer td.mcnTextContent,td.preheaderContainer td.mcnTextContent p{ /*@editable*/font-size:14px !important; /*@editable*/line-height:115% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Header Text @tip Make the header text larger in size for better readability on small screens. */ td.headerContainer td.mcnTextContent,td.headerContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Upper Body Text @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.upperBodyContainer td.mcnTextContent,td.upperBodyContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Left Column Text @tip Make the left column text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.leftColumnContainer td.mcnTextContent,td.leftColumnContainer td.mcnTextContent p{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Center Column Text @tip Make the center column text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.centerColumnContainer td.mcnTextContent,td.centerColumnContainer td.mcnTextContent p{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Right Column Text @tip Make the right column text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.rightColumnContainer td.mcnTextContent,td.rightColumnContainer td.mcnTextContent p{ /*@editable*/font-size:16px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section Lower Body Text @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ td.lowerBodyContainer td.mcnTextContent,td.lowerBodyContainer td.mcnTextContent p{ /*@editable*/font-size:18px !important; /*@editable*/line-height:125% !important; } } @media only screen and (max-width:480px){ /* @tab Mobile Styles @section footer text @tip Make the body content text larger in size for better readability on small screens. */ td.footerContainer td.mcnTextContent,td.footerContainer td.mcnTextContent p{ /*@editable*/font-size:14px !important; /*@editable*/line-height:115% !important; } }</style></head> <body> <center> <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable"> <tr> <td align="center" valign="top" id="bodyCell"> <!--[if gte mso 9]> <table align="center" border="0" cellspacing="0" cellpadding="0" style="width:600px;" width="600"> <tr> <td align="center" valign="top"> <![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer"> <tr> <td align="center" valign="top" id="templatePreheader"> <!-- BEGIN PREHEADER // --> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="preheaderContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="366" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-left:18px; padding-bottom:9px; padding-right:0;"> Localizaciones nocturnas cerca de ti </td> </tr> </tbody></table> <table align="right" border="0" cellpadding="0" cellspacing="0" width="197" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right:18px; padding-bottom:9px; padding-left:0;"> <a href="*|ARCHIVE|*" target="_blank">View this email in your browser</a> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END PREHEADER --> </td> </tr> <tr> <td align="center" valign="top" id="templateHeader"> <!-- BEGIN HEADER // --> <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock"> <tbody class="mcnImageBlockOuter"> <tr> <td valign="top" style="padding:9px" class="mcnImageBlockInner"> <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer"> <tbody><tr> <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0;"> <img align="left" alt="" src="https://gallery.mailchimp.com/200f5dddbe9112ab8d21e9c28/images/8775d11f-8bf4-4b54-a7de-3bc208affbc9.jpg" width="500" style="max-width:500px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage"> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END HEADER --> </td> </tr> <tr> <td align="center" valign="top" id="templateUpperBody"> <!-- BEGIN UPPER BODY // --> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="upperBodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right: 18px; padding-bottom: 9px; padding-left: 18px;"> <h1>Querido amante nocturno</h1> <h3>De las fotografías</h3> <p>Aquí tienes las localizaciones más recientes cerca de tu área. Recuerda que en cualquier momento puedes cambiar la configuración de tus Avisos dentro del panel de configuración de tu perfil en <a href="http://www.subexpuesta.com/" target="_blank">www.subexpuesta.com</a></p> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END UPPER BODY --> </td> </tr> <tr> <!-- BEGIN COLUMNS // --> <td align="center" valign="top" id="templateColumns"> <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">';
    var estiloLocalizacion = 'leftColumnContainer';
    User.find({}, '-salt -hashedPassword', function(err, users) {
        if (err) return res.send(500, err);

        for (var i = 0; i < users.length; i++) {
            //console.log('username: ' + users[i].username);
            if (users[i].avisos.length > 0) {
              if(users[i].frecuenciaAviso==3){
                //console.log('Total de avisos para el usuario: ' + users[i].username + ' son de: ' + users[i].avisos.length +' frecuenciaAviso: '+users[i].frecuenciaAviso);
                var numavisos = 0;
                while (numavisos < users[i].avisos.length) {

                    localizacionesHTML += '<tr><td align="center" style="text-align:center; display:inline-block;" valign="top">'
                    localizacionesHTML += '<!-- BEGIN INDIVIDUAL COLUMNS // --><!--[if gte mso 9]><table align="center" border="0" cellspacing="0" cellpadding="0" style="width:600px;" width="600"><tr>';

                    for (var contador = 0; contador < 3 && numavisos < users[i].avisos.length; contador++) {
                        console.log('AVISO: ' + numavisos + ' titulo: ' + users[i].avisos[numavisos].titulo);
                        localizacionesHTML += '<td align="center" valign="top" style="width:197px;" width="197"><![endif]-->';
                        if (contador == 0) {
                            estiloLocalizacion = 'leftColumnContainer';
                        } else {
                            if (contador == 1) {
                                estiloLocalizacion = 'centerColumnContainer';
                            } else {
                                estiloLocalizacion = 'rightColumnContainer';
                            }
                        }

                        localizacionesHTML += '<div style="display:inline-block; vertical-align:top; width:197px;" class="columnWidth"><table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="columnsContainer"><tr><td valign="top" class="' + estiloLocalizacion + '"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnCaptionBlock"><tbody class="mcnCaptionBlockOuter"><tr><td class="mcnCaptionBlockInner" valign="top" style="padding:9px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="mcnCaptionBottomContent" width="false"><tbody><tr><td class="mcnCaptionBottomImageContent" align="left" valign="top" style="padding:0 9px 9px 9px;">';
                        localizacionesHTML += '<a href="' + users[i].avisos[numavisos].url + '" title="" class="" target="_blank">';
                        localizacionesHTML += '<img alt="" src="' + users[i].avisos[numavisos].imagen + '" width="161" style="max-width:340px;" class="mcnImage">';
                        localizacionesHTML += '</a></td></tr><tr><td class="mcnTextContent" valign="top" style="padding:0 9px 0 9px;" width="161">' + users[i].avisos[numavisos].titulo + ' por ' + users[i].avisos[numavisos].autor + '. Está a una distancia de ' + users[i].avisos[numavisos].distanciakm + 'km.</td></tr></tbody></table></td></tr></tbody></table></td></tr></table></div>';
                        localizacionesHTML += '<!--[if gte mso 9]></td>';
                        numavisos++;
                    }

                    localizacionesHTML += '<!--[if gte mso 9]></td></tr></table><![endif]-->';
                    localizacionesHTML += '</td></tr>';
                }

                localizacionesHTML += '</table> </td> <!-- // END COLUMNS --> </tr> <tr> <td align="center" valign="top" id="templateLowerBody"> <!-- BEGIN LOWER BODY // --> <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="lowerBodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"> <tbody class="mcnDividerBlockOuter"> <tr> <td class="mcnDividerBlockInner" style="padding: 18px;"> <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top-width: 1px;border-top-style: solid;border-top-color: #999999;"> <tbody><tr> <td> <span></span> </td> </tr> </tbody></table> </td> </tr> </tbody> </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right: 18px; padding-bottom: 9px; padding-left: 18px;"> <p>Esperemos que te guste todas estas localizaciones y si te animas a fotografiar estas localizaciones u otras que tengas en mente, no te olvides de colaborar con nosotros aportando tu localización para el resto de fotógrafos nocturnos.<br> <br> <em style="line-height:20.7999992370605px">Un saludo afectuoso&nbsp;<a href="http://www.subexpuesta.com/" target="_blank">www.subexpuesta.com</a></em></p> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </table> <!-- // END LOWER BODY --> </td> </tr> <tr> <td align="center" valign="top" id="templateFooter"> <!-- BEGIN FOOTER // --> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td valign="top" class="footerContainer"></td> </tr> </table> <!-- // END FOOTER --> </td> </tr> </table> <!--[if gte mso 9]> </td> </tr> </table> <![endif]--> </td> </tr> </table> </center> </body> </html>';
                //console.log(localizacionesHTML);
                
                var mailer = nodemailer.createTransport(sgTransport(options));
                var email = {
                    to: users[i].email,
                    from: 'subexpuestaweb@gmail.com',
                    subject: 'Localizaciones nocturnas cerca de ti!',
                    html: localizacionesHTML
                };

                mailer.sendMail(email, function(err, respuesta) {
                    if (err) {
                        console.log(err);
                        return handleError(res, err);
                    }
                    //return res.json(200, respuesta);

                });

                User.findOneAndUpdate({
                        _id: users[i]._id
                    }, {
                        $set: {
                            avisos: []
                        }
                    }, {
                        safe: true,
                        upsert: true
                    },
                    function(err, usuario) {
                        if (!err) {
                            console.log('Avisos quitados correctamente');
                            //return res.json(200, usuario);
                        } else {
                            console.log('Error removeAvisos  ' + err);
                            return handleError(res, err);
                        }
                    });
              }
            } //Fin usuario con avisos

        }


    });
    return res.json(200);



};

// remove all Avisos
exports.removeAvisos = function(req, res) {

    var query = {
        _id: req.params.id
    };
    var options = {
        new: true
    };
    //console.log('query update sorteo: '+req.body);


    //console.log('req.body: '+JSON.stringify(item));
    User.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                avisos: []
            }
        }, {
            safe: true,
            upsert: true
        },
        function(err, usuario) {
            if (!err) {
                console.log('Avisos quitados correctamente');
                return res.json(200, usuario);
            } else {
                console.log('Error removeAvisos  ' + err);
                return handleError(res, err);
            }
        });

};


exports.actualizarUsuarioVip = function(req, res){
        User.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                vip: true
            }
        }, {
            safe: true,
            upsert: true
        },
        function(err, usuario) {
            if (!err) {
                return res.json(200, usuario);
            } else {
                return handleError(res, err);
            }
        });
};

exports.actualizarUsuarioNoVip = function(req, res){
        User.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                vip: false
            }
        }, {
            safe: true,
            upsert: true
        },
        function(err, usuario) {
            if (!err) {
                return res.json(200, usuario);
            } else {
                return handleError(res, err);
            }
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