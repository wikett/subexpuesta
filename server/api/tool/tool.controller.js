'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
//var xml = require('xml');
var Tool = require('./tool.model');
var Localizaciones = require('../localizaciones/localizaciones.model');




function seoTitulo (text){
        function eliminaracento(letra) {
            switch (letra) {
                case 'á':
                    return 'a';
                case 'é':
                    return 'e';
                case 'í':
                    return 'i';
                case 'ó':
                    return 'o';
                case 'ú':
                    return 'u';
                case 'ñ':
                    return 'n';
                default:
                    return letra;
            }
        }; //
        function eliminarcaracteres(text) {
            var newtext = '';
            for (var i in text) {
                newtext += eliminaracento(text[i]);
            };
            return newtext;
        }; //fin funcion
        if(!_.isUndefined(text))
        return eliminarcaracteres(text.toLowerCase()).replace(/[-\s]+/g, '-') // convert spaces to hyphens
            .replace(/[^-\w\s]/g, '') // remove unneeded chars
            .replace(/^\s+|\s+$/g, '') + ''; // trim leading/trailing spaces
};

function generate_xml_sitemap() {
    // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
    var urls = ['recomendaciones', 'blog', 'contacto', 'mejora', 'sobrenosotros'];

    // the root of your website - the protocol and the domain name with a trailing slash
    var root_path = 'http://www.subexpuesta.com/';
    // XML sitemap generation starts here
    var priority = 0.5;
    var freq = 'monthly';
    var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    // home
    xml += '<url>';
    xml += '<loc>'+ root_path + '</loc>';
    xml += '<changefreq>weekly</changefreq>';
    xml += '<priority>1</priority>';
    xml += '</url>';

    //static page
    for (var i in urls) {
        xml += '<url>';
        xml += '<loc>'+ root_path + urls[i] + '</loc>';
        xml += '<changefreq>'+ freq +'</changefreq>';
        xml += '<priority>'+ priority +'</priority>';
        xml += '</url>';
        i++;
    }

    //localizaciones
    var xmlLocalizaciones = '';
    priority = 0.8;
    //console.log(xml);
    Localizaciones.find(function (err, localizaciones) {
      if(err) { return handleError(res, err); }
      //console.log('localizaciones: '+localizaciones.length);
        _.forEach(localizaciones,function(n,key){
          
          xmlLocalizaciones += '<url><loc>'+ root_path + 'localizaciones/' + n._id + '/' +  seoTitulo(n.titulo) + '</loc>' + '<changefreq>'+ freq +'</changefreq>' + '<priority>'+ priority +'</priority>' + '</url>';

          xml += '<url>';
          xml += '<loc>'+ root_path + 'localizaciones/' + n._id + '/' +  seoTitulo(n.titulo) + '</loc>';
          xml += '<changefreq>'+ freq +'</changefreq>';
          xml += '<priority>'+ priority +'</priority>';
          xml += '</url>';
        })

        console.log("xmlLocalizaciones: "+xmlLocalizaciones);
      });
    //console.log('////////////////////////////////////////////////////////'+xmlLocalizaciones);
    console.log("/n////////////////////////////////////////////////xmlLocalizaciones: "+xmlLocalizaciones);
    xml += '</urlset>';
    //console.log(xmlLocalizaciones);
    return xml;
};

// Get list of tools
exports.index = function(req, res) {
    
  Tool.find(function (err, tools) {
    if(err) { return handleError(res, err); }
    return res.json(200, tools);
  });
};

// Get a single tool
exports.show = function(req, res) {

//console.log(". = %s", path.resolve("."));
//console.log("__dirname = %s", path.resolve(__dirname));
switch (req.params.id){
  case "1": //create xml file
  var sitemap = generate_xml_sitemap();
    /*fs.writeFile(path.resolve(".")+"/client/pru.xml", sitemap, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); */
res.set('Content-Type', 'text/xml');
res.send(sitemap);
    break;
  case "2": 
var root_path = 'http://www.subexpuesta.com/';
    // XML sitemap generation starts here
    var priority = 0.5;
    var freq = 'monthly';
    var xml = '';
  Localizaciones.find(function (err, localizaciones) {
      if(err) { return handleError(res, err); }
      //console.log('localizaciones: '+localizaciones.length);
        _.forEach(localizaciones,function(n,key){
          
         // xmlLocalizaciones += '<url><loc>'+ root_path + 'localizaciones/' + n._id + '/' +  seoTitulo(n.titulo) + '</loc>' + '<changefreq>'+ freq +'</changefreq>' + '<priority>'+ priority +'</priority>' + '</url>';

          xml += '<url>';
          xml += '<loc>'+ root_path + 'localizaciones/' + n._id + '/' +  seoTitulo(n.titulo) + '</loc>';
          xml += '<changefreq>'+ freq +'</changefreq>';
          xml += '<priority>'+ priority +'</priority>';
          xml += '</url>';
        })
        res.set('Content-Type', 'text/xml');
        res.send(xml);
        
      });

    break;
  default: res.send('Otro');
}
};

// Creates a new tool in the DB.
exports.create = function(req, res) {
  Tool.create(req.body, function(err, tool) {
    if(err) { return handleError(res, err); }
    return res.json(201, tool);
  });
};

// Updates an existing tool in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Tool.findById(req.params.id, function (err, tool) {
    if (err) { return handleError(res, err); }
    if(!tool) { return res.send(404); }
    var updated = _.merge(tool, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, tool);
    });
  });
};

// Deletes a tool from the DB.
exports.destroy = function(req, res) {
  Tool.findById(req.params.id, function (err, tool) {
    if(err) { return handleError(res, err); }
    if(!tool) { return res.send(404); }
    tool.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.createxml = function(req, res){

  console.log('createXML!!!!!!!!!!!!');
};

function handleError(res, err) {
  return res.send(500, err);
}