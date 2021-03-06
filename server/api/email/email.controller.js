'use strict';

var _ = require('lodash');
var Email = require('./email.model');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
    auth: {
        api_user: 'wikett',
        api_key: 'poiuasdf77'
    }
}



exports.enviarEmail = function(req, res) {

  //console.log('enviarEmail!!!!!!!!!!!!!!!: '+req.body.direccion);
  var mailer = nodemailer.createTransport(sgTransport(options));
  var email = {
      to: req.body.direccion,
      from: 'info@subexpuesta.com',
      subject: 'Bienvendio a www.subexpuesta.com',
      text: 'Bienvendio a www.subexpuesta.com',
      html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"> <head> <!-- NAME: 1 COLUMN --> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>*|MC:SUBJECT|*</title> <style type="text/css">body,#bodyTable,#bodyCell{height:100% !important;margin:0;padding:0;width:100% !important;}table{border-collapse:collapse;}img,a img{border:0;outline:none;text-decoration:none;}h1,h2,h3,h4,h5,h6{margin:0;padding:0;}p{margin:1em 0;padding:0;}a{word-wrap:break-word;}.ReadMsgBody{width:100%;}.ExternalClass{width:100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:100%;}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}#outlook a{padding:0;}img{-ms-interpolation-mode:bicubic;}body,table,td,p,a,li,blockquote{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}#bodyCell{padding:20px;}.mcnImage{vertical-align:bottom;}.mcnTextContent img{height:auto !important;}/*@tab Page@section background style@tip Set the background color and top border for your email. You may want to choose colors that match your companys branding.*/body,#bodyTable{/*@editable*/background-color:#F2F2F2;}/*@tab Page@section background style@tip Set the background color and top border for your email. You may want to choose colors that match your companys branding.*/#bodyCell{/*@editable*/border-top:0;}/*@tab Page@section email border@tip Set the border for your email.*/#templateContainer{/*@editable*/border:0;}/*@tab Page@section heading 1@tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.@style heading 1*/h1{/*@editable*/color:#606060 !important;display:block;/*@editable*/font-family:Helvetica;/*@editable*/font-size:40px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:-1px;margin:0;/*@editable*/text-align:left;}/*@tab Page@section heading 2@tip Set the styling for all second-level headings in your emails.@style heading 2*/h2{/*@editable*/color:#404040 !important;display:block;/*@editable*/font-family:Helvetica;/*@editable*/font-size:26px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:-.75px;margin:0;/*@editable*/text-align:left;}/*@tab Page@section heading 3@tip Set the styling for all third-level headings in your emails.@style heading 3*/h3{/*@editable*/color:#606060 !important;display:block;/*@editable*/font-family:Helvetica;/*@editable*/font-size:18px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:-.5px;margin:0;/*@editable*/text-align:left;}/*@tab Page@section heading 4@tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings.@style heading 4*/h4{/*@editable*/color:#808080 !important;display:block;/*@editable*/font-family:Helvetica;/*@editable*/font-size:16px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;margin:0;/*@editable*/text-align:left;}/*@tab Preheader@section preheader style@tip Set the background color and borders for your emails preheader area.*/#templatePreheader{/*@editable*/background-color:#FFFFFF;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Preheader@section preheader text@tip Set the styling for your emails preheader text. Choose a size and color that is easy to read.*/.preheaderContainer .mcnTextContent,.preheaderContainer .mcnTextContent p{/*@editable*/color:#606060;/*@editable*/font-family:Helvetica;/*@editable*/font-size:11px;/*@editable*/line-height:125%;/*@editable*/text-align:left;}/*@tab Preheader@section preheader link@tip Set the styling for your emails header links. Choose a color that helps them stand out from your text.*/.preheaderContainer .mcnTextContent a{/*@editable*/color:#606060;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Header@section header style@tip Set the background color and borders for your emails header area.*/#templateHeader{/*@editable*/background-color:#FFFFFF;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Header@section header text@tip Set the styling for your emails header text. Choose a size and color that is easy to read.*/.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{/*@editable*/color:#606060;/*@editable*/font-family:Helvetica;/*@editable*/font-size:15px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Header@section header link@tip Set the styling for your emails header links. Choose a color that helps them stand out from your text.*/.headerContainer .mcnTextContent a{/*@editable*/color:#6DC6DD;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Body@section body style@tip Set the background color and borders for your emails body area.*/#templateBody{/*@editable*/background-color:#FFFFFF;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Body@section body text@tip Set the styling for your emails body text. Choose a size and color that is easy to read.*/.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{/*@editable*/color:#606060;/*@editable*/font-family:Helvetica;/*@editable*/font-size:15px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Body@section body link@tip Set the styling for your emails body links. Choose a color that helps them stand out from your text.*/.bodyContainer .mcnTextContent a{/*@editable*/color:#6DC6DD;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Footer@section footer style@tip Set the background color and borders for your emails footer area.*/#templateFooter{/*@editable*/background-color:#FFFFFF;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Footer@section footer text@tip Set the styling for your emails footer text. Choose a size and color that is easy to read.*/.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{/*@editable*/color:#606060;/*@editable*/font-family:Helvetica;/*@editable*/font-size:11px;/*@editable*/line-height:125%;/*@editable*/text-align:left;}/*@tab Footer@section footer link@tip Set the styling for your emails footer links. Choose a color that helps them stand out from your text.*/.footerContainer .mcnTextContent a{/*@editable*/color:#606060;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}@media only screen and (max-width: 480px){body,table,td,p,a,li,blockquote{-webkit-text-size-adjust:none !important;}}@media only screen and (max-width: 480px){body{width:100% !important;min-width:100% !important;}}@media only screen and (max-width: 480px){td[id=bodyCell]{padding:10px !important;}}@media only screen and (max-width: 480px){table[class=mcnTextContentContainer]{width:100% !important;}}@media only screen and (max-width: 480px){table[class=mcnBoxedTextContentContainer]{width:100% !important;}}@media only screen and (max-width: 480px){table[class=mcpreview-image-uploader]{width:100% !important;display:none !important;}}@media only screen and (max-width: 480px){img[class=mcnImage]{width:100% !important;}}@media only screen and (max-width: 480px){table[class=mcnImageGroupContentContainer]{width:100% !important;}}@media only screen and (max-width: 480px){td[class=mcnImageGroupContent]{padding:9px !important;}}@media only screen and (max-width: 480px){td[class=mcnImageGroupBlockInner]{padding-bottom:0 !important;padding-top:0 !important;}}@media only screen and (max-width: 480px){tbody[class=mcnImageGroupBlockOuter]{padding-bottom:9px !important;padding-top:9px !important;}}@media only screen and (max-width: 480px){table[class=mcnCaptionTopContent],table[class=mcnCaptionBottomContent]{width:100% !important;}}@media only screen and (max-width: 480px){table[class=mcnCaptionLeftTextContentContainer],table[class=mcnCaptionRightTextContentContainer],table[class=mcnCaptionLeftImageContentContainer],table[class=mcnCaptionRightImageContentContainer],table[class=mcnImageCardLeftTextContentContainer],table[class=mcnImageCardRightTextContentContainer]{width:100% !important;}}@media only screen and (max-width: 480px){td[class=mcnImageCardLeftImageContent],td[class=mcnImageCardRightImageContent]{padding-right:18px !important;padding-left:18px !important;padding-bottom:0 !important;}}@media only screen and (max-width: 480px){td[class=mcnImageCardBottomImageContent]{padding-bottom:9px !important;}}@media only screen and (max-width: 480px){td[class=mcnImageCardTopImageContent]{padding-top:18px !important;}}@media only screen and (max-width: 480px){td[class=mcnImageCardLeftImageContent],td[class=mcnImageCardRightImageContent]{padding-right:18px !important;padding-left:18px !important;padding-bottom:0 !important;}}@media only screen and (max-width: 480px){td[class=mcnImageCardBottomImageContent]{padding-bottom:9px !important;}}@media only screen and (max-width: 480px){td[class=mcnImageCardTopImageContent]{padding-top:18px !important;}}@media only screen and (max-width: 480px){table[class=mcnCaptionLeftContentOuter] td[class=mcnTextContent],table[class=mcnCaptionRightContentOuter] td[class=mcnTextContent]{padding-top:9px !important;}}@media only screen and (max-width: 480px){td[class=mcnCaptionBlockInner] table[class=mcnCaptionTopContent]:last-child td[class=mcnTextContent]{padding-top:18px !important;}}@media only screen and (max-width: 480px){td[class=mcnBoxedTextContentColumn]{padding-left:18px !important;padding-right:18px !important;}}@media only screen and (max-width: 480px){td[class=mcnTextContent]{padding-right:18px !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section template width@tip Make the template fluid for portrait or landscape view adaptability. If a fluid layout doesnt work for you, set the width to 300px instead.*/table[id=templateContainer],table[id=templatePreheader],table[id=templateHeader],table[id=templateBody],table[id=templateFooter]{/*@tab Mobile Styles@section template width@tip Make the template fluid for portrait or landscape view adaptability. If a fluid layout doesnt work for you, set the width to 300px instead.*/max-width:600px !important;/*@editable*/width:100% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 1@tip Make the first-level headings larger in size for better readability on small screens.*/h1{/*@editable*/font-size:24px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 2@tip Make the second-level headings larger in size for better readability on small screens.*/h2{/*@editable*/font-size:20px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 3@tip Make the third-level headings larger in size for better readability on small screens.*/h3{/*@editable*/font-size:18px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 4@tip Make the fourth-level headings larger in size for better readability on small screens.*/h4{/*@editable*/font-size:16px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Boxed Text@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/table[class=mcnBoxedTextContentContainer] td[class=mcnTextContent],td[class=mcnBoxedTextContentContainer] td[class=mcnTextContent] p{/*@editable*/font-size:18px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Visibility@tip Set the visibility of the emails preheader on small screens. You can hide it to save space.*/table[id=templatePreheader]{/*@editable*/display:block !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Text@tip Make the preheader text larger in size for better readability on small screens.*/td[class=preheaderContainer] td[class=mcnTextContent],td[class=preheaderContainer] td[class=mcnTextContent] p{/*@editable*/font-size:14px !important;/*@editable*/line-height:115% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Header Text@tip Make the header text larger in size for better readability on small screens.*/td[class=headerContainer] td[class=mcnTextContent],td[class=headerContainer] td[class=mcnTextContent] p{/*@editable*/font-size:18px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Body Text@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/td[class=bodyContainer] td[class=mcnTextContent],td[class=bodyContainer] td[class=mcnTextContent] p{/*@editable*/font-size:18px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section footer text@tip Make the body content text larger in size for better readability on small screens.*/td[class=footerContainer] td[class=mcnTextContent],td[class=footerContainer] td[class=mcnTextContent] p{/*@editable*/font-size:14px !important;/*@editable*/line-height:115% !important;}}@media only screen and (max-width: 480px){td[class=footerContainer] a[class=utilityLink]{display:block !important;}}</style></head> <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"> <center> <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable"> <tr> <td align="center" valign="top" id="bodyCell"> <!-- BEGIN TEMPLATE // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateContainer"> <tr> <td align="center" valign="top"> <!-- BEGIN PREHEADER // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templatePreheader"> <tr> <td valign="top" class="preheaderContainer" style="padding-top:9px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="366" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-left:18px; padding-bottom:9px; padding-right:0;"> Este email es sólo informativo, no resopnda a este correo. </td> </tr> </tbody></table> <table align="right" border="0" cellpadding="0" cellspacing="0" width="197" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right:18px; padding-bottom:9px; padding-left:0;"> <a href="*|ARCHIVE|*" target="_blank">View this email in your browser</a> </td> </tr> </tbody></table> </td> </tr> </tbody></table></td> </tr> </table> <!-- // END PREHEADER --> </td> </tr> <tr> <td align="center" valign="top"> <!-- BEGIN HEADER // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateHeader"> <tr> <td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock"> <tbody class="mcnImageBlockOuter"> <tr> <td valign="top" style="padding:9px" class="mcnImageBlockInner"> <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer"> <tbody><tr> <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;"> <img align="center" alt="" src="https://gallery.mailchimp.com/200f5dddbe9112ab8d21e9c28/images/8775d11f-8bf4-4b54-a7de-3bc208affbc9.jpg" width="500" style="max-width:500px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage"> </td> </tr> </tbody></table> </td> </tr> </tbody></table></td> </tr> </table> <!-- // END HEADER --> </td> </tr> <tr> <td align="center" valign="top"> <!-- BEGIN BODY // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateBody"> <tr> <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right: 18px; padding-bottom: 9px; padding-left: 18px;"> <h1>Gracias por registrarte!</h1><h3>Y bienvenido!!</h3><p>Ya estas en disposición de poder utilizar todos los servicios de <a href="http://www.subexpuesta.com" target="_blank">www.subexpuesta.com</a><br>Comparte tus localizaciones de fotografía nocturna, explora nuevos sitios y comparte las que más te gusten.</p><p><img align="center" height="333" src="https://gallery.mailchimp.com/200f5dddbe9112ab8d21e9c28/images/2a839938-bed4-4c07-8b27-8047584e9ea3.jpg" style="width: 500px; height: 333px; margin: 0px;" width="500"></p><p>¿Tienes alguna idea nueva para la web? Únete a la comunidad y haz más grande la web</p> </td> </tr> </tbody></table> </td> </tr> </tbody></table></td> </tr> </table> <!-- // END BODY --> </td> </tr> <tr> <td align="center" valign="top"> <!-- BEGIN FOOTER // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateFooter"> <tr> <td valign="top" class="footerContainer" style="padding-bottom:9px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="mcnTextContentContainer"> <tbody><tr> <td valign="top" class="mcnTextContent" style="padding-top:9px; padding-right: 18px; padding-bottom: 9px; padding-left: 18px;"> <em>Copyright © 2015 www.subexpuesta.com, Todos los derechos reservados</em><br><br><br>&nbsp; </td> </tr> </tbody></table> </td> </tr> </tbody></table></td> </tr> </table> <!-- // END FOOTER --> </td> </tr> </table> <!-- // END TEMPLATE --> </td> </tr> </table> </center> </body></html>'
  };

  mailer.sendMail(email, function(err, respuesta) {
      if (err) { 
          console.log(err);
          return handleError(res, err);
      }
      return res.json(200, respuesta);

  });


};




exports.enviarEmailContacto = function(req, res) {

  //console.log('enviarEmail!!!!!!!!!!!!!!!: '+JSON.stringify(req.body, null, 4));
  console.log('enviarEmail!!!!!!!!!!!!!!!: '+JSON.stringify(req.body, null, 4));
  /*var direccionesMail;
  if(!_.isUndefined(req.body.organizador))
  {
    direccionesMail = ['subexpuestaweb@gmail.com', req.body.organizador];
  }
  else
  {
    direccionesMail = ['subexpuestaweb@gmail.com'];
  }*/
  var mailer = nodemailer.createTransport(sgTransport(options));
  var email = {
      to: 'enrique.ac9@gmail.com',
      from: req.body.direccion,
      bcc: 'subexpuestaweb@gmail.com',
      subject: req.body.asunto+' ('+req.body.nombre+')',
      text: 'Bienvendio a www.subexpuesta.com',
      html: req.body.mensaje
  };

  mailer.sendMail(email, function(err, respuesta) {
      if (err) { 
          console.log(err);
          return handleError(res, err);
      }
      return res.json(200, respuesta);

  });


};



// Get list of emails
exports.index = function(req, res) {
  console.log('get list of emails');
  Email.find(function (err, emails) {
    if(err) { return handleError(res, err); }
    return res.json(200, emails);
  });
};

// Get a single email
exports.show = function(req, res) {
  Email.findById(req.params.id, function (err, email) {
    if(err) { return handleError(res, err); }
    if(!email) { return res.send(404); }
    return res.json(email);
  });
};

// Creates a new email in the DB.
exports.create = function(req, res) {
  Email.create(req.body, function(err, email) {
    if(err) { return handleError(res, err); }
    return res.json(201, email);
  });
};

// Updates an existing email in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Email.findById(req.params.id, function (err, email) {
    if (err) { return handleError(res, err); }
    if(!email) { return res.send(404); }
    var updated = _.merge(email, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, email);
    });
  });
};

// Deletes a email from the DB.
exports.destroy = function(req, res) {
  Email.findById(req.params.id, function (err, email) {
    if(err) { return handleError(res, err); }
    if(!email) { return res.send(404); }
    email.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
