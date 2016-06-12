'use strict';

angular.module('subexpuestaV2App')
    .controller('AvisadorCtrl', function($scope, $log, uiGmapGoogleMapApi, Auth, Avisador, Email) {
        $scope.user = Auth.getCurrentUser();
        $scope.avisador = new Avisador();
        $scope.dt = null;

        $scope.contactosAvisosSeleccionados = {};
        $scope.conjuntoEmail = '';
        $scope.contactosSeleccionados = [];
        $scope.mensajeError = "";
        $scope.contanctoAdded = false;
        $scope.avisadorCreado = false;
        $scope.enviarCopia = true;

        $scope.nuevoContacto = '';

        $scope.addNuevoContacto = function() {
            if ($scope.nuevoContacto.length > 0) {
                var nuevoContactoAviso = {};
                nuevoContactoAviso.email = $scope.nuevoContacto;
                nuevoContactoAviso.seleccionado = true;
                $scope.user.contactosAvisos.push(nuevoContactoAviso);
                $scope.nuevoContacto = '';
                $scope.contanctoAdded = true;
            }
        }
        $scope.modificarContactoAviso = function(contacto, index) {
            $scope.user.contactosAvisos[index].seleccionado = !$scope.user.contactosAvisos[index].seleccionado;

            var selected = [];


            selected = _.filter($scope.user.contactosAvisos, function(item) {
                return item.seleccionado === true;
            });

            if (selected.length === 0) {
                $scope.contanctoAdded = false;
            } else {
                $scope.contanctoAdded = true;
            }

        }

        $scope.today = function() {
            $scope.dt = new Date();
        };

        $scope.toggleSelection = function(contacto, index) {
            $scope.contactosSeleccionados.push(contacto);
            $scope.conjuntoEmail = '';
           // $log.debug('Click');
        }

        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.closeAlert = function() {
            $scope.mensajeError = "";
        };

        $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[3];


        $scope.place = null;

        if ($scope.place != null) {

            $scope.marker.coords.latitude = $scope.place.geometry.location.lat();
            $scope.marker.coords.longitude = $scope.place.geometry.location.lng();
        }

        $scope.actualizarDatos = function() {

            //console.log(JSON.stringify($scope.place.geometry.location.lat()));
            //console.log(JSON.stringify($scope.place.geometry.location.latitude));
            $scope.marker.coords.latitude = 40.399995;
            $scope.marker.coords.longitude = 0.399995;
        }

        $scope.defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(44.399995, 4.087896),
            new google.maps.LatLng(40.66541, -4.31715));

        $scope.map = {
            center: {
                latitude: 40.399995,
                longitude: -4.087896
            },

            zoom: 6,
            events: {
                click: function(map, eventName, handlerArgs) {

                    $scope.$apply(function() {
                        $scope.marker.coords.latitude = handlerArgs[0].latLng.lat();
                        $scope.marker.coords.longitude = handlerArgs[0].latLng.lng();
                        $scope.marker.icon = 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png';
                    });
                }
            }
        };

        $scope.marker = {
            id: 0,
            icon: 'http://res.cloudinary.com/djhqderty/image/upload/v1430472337/icono-mapa_xnqyqd.png',
            coords: {
                latitude: 0,
                longitude: 0
            },
            options: {
                draggable: true
            },
            events: {
                dragend: function(marker, eventName, args) {
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                }
            }
        };

        uiGmapGoogleMapApi.then(function(maps) {
            setTimeout(function() {
                $scope.showMap = true;
                $scope.$apply();
            }, 100);
        });

        $scope.sliderChange = function() {
            //console.log("slider value changed : ");
            //$scope.map.circle
            if (!_.isNull($scope.place))
                if ($scope.place !== undefined && !_.isUndefined($scope.place.geometry.location)) {
                    // $scope.map.circle.radius = $scope.sliderValue * 1000;
                    //console.log(JSON.stringify($scope.place.geometry.location));

                    if (!_.isUndefined($scope.place.geometry.location.lat())) {
                        $scope.marker.coords.latitude = $scope.place.geometry.location.lat();
                        $scope.marker.coords.longitude = $scope.place.geometry.location.lng();
                        $scope.map.center.latitude = $scope.place.geometry.location.lat();
                        $scope.map.center.longitude = $scope.place.geometry.location.lng();
                        $scope.map.zoom = 10;
                    }
                }
        };

        $scope.$watch('place', function() {
            $scope.sliderChange();
        });

        $scope.guardarAvisador = function() {
            var destinatarios = [];
            var destinatario = {};
            var destinatariosString = '';

            if (_.isUndefined($scope.avisador.donde)) {
                $scope.mensajeError = "Por favor, debe indicar a donde va.";
                return;
            }
            if (_.isUndefined($scope.dt)) {
                $scope.mensajeError = "Por favor, debe indicar la fecha de su salida";
                return;
            }
            if (_.isUndefined($scope.avisador.horaSalida)) {
                $scope.mensajeError = "Por favor, debe indicar la hora de Salida";
                return;
            }
            if (_.isUndefined($scope.avisador.horaLlegada)) {
                $scope.mensajeError = "Por favor, debe indicar la hora de Llegada";
                return;
            }
            if ($scope.marker.coords.latitude === 0) {
                $scope.mensajeError = "Por favor, debe indicar un punto del mapa donde irá aproximadamente.";
                return;
            }
            if (!$scope.contanctoAdded) {
                $scope.mensajeError = "Por favor, debe seleccionar un contacto para enviarle un email.";
                return;
            } else {
                _.each($scope.user.contactosAvisos, function(item, index) {
                    destinatario = {};
                    destinatario.nombre = item.nombre;
                    destinatario.email = item.email;
                    destinatario.seleccionado = item.seleccionado;
                    destinatarios.push(destinatario);
                    $log.debug('index: ' + index + ' destinatarios: ' + destinatariosString);
                    if (item.seleccionado) {
                        if (index === $scope.user.contactosAvisos.length - 1) {
                            destinatariosString += destinatario.email;
                        } else {
                            destinatariosString += destinatario.email + ",";
                        }
                    }

                })
            }
            $scope.enviado = true;
            //$log.debug('destinatarios: ' + destinatariosString);
            $scope.avisador.fecha = $scope.dt;
            $scope.avisador.longitud = $scope.marker.coords.longitude;
            $scope.avisador.latitud = $scope.marker.coords.latitude;
            $scope.avisador.destinatarios = destinatarios;
            
            //$log.debug('nuevo envento: ' + JSON.stringify(moment($scope.avisador.fecha).format('DD/MM/YYYY'), null, 4));
            //$log.debug('nuevo envento: ' + JSON.stringify(moment($scope.avisador.horaSalida).format('hh:mm A'), null, 4));
            //$log.debug('nuevo envento: ' + JSON.stringify(moment($scope.avisador.horaLlegada).format('hh:mm A'), null, 4));
            if($scope.enviarCopia){
                destinatariosString += ","+$scope.user.email;
            }
            //$log.debug('destinatarios: '+destinatariosString);
            

            $scope.avisador.$save().then(function(response) {
                $scope.avisadorCreado = true;

                var googleUrl = "https://www.google.com/maps?q="+$scope.marker.coords.latitude+"+"+$scope.marker.coords.longitude+"&ll="+$scope.marker.coords.latitude+"+"+$scope.marker.coords.longitude;
                googleUrl = "http://maps.google.com/maps?daddr="+$scope.marker.coords.latitude+","+$scope.marker.coords.longitude+"&amp;ll="+$scope.marker.coords.latitude+","+$scope.marker.coords.longitude;
                var imgGoogleMaps = "https://maps.googleapis.com/maps/api/staticmap?center="+$scope.marker.coords.latitude+","+$scope.marker.coords.longitude+"&zoom=6&size=600x300&maptype=roadmap&markers="+$scope.marker.coords.latitude+","+$scope.marker.coords.longitude+"&key=AIzaSyAfYUAtiwSJdy2brPkcLzUvG_YZJ97vMOs";
                var mensajeAdicional = "";
                
                var mapsDevices = "<script>function myNavFunc(){ if( (navigator.platform.indexOf('iPhone') != -1) || (navigator.platform.indexOf('iPod') != -1) || (navigator.platform.indexOf('iPad') != -1)) window.open('maps://maps.google.com/maps?daddr="+$scope.marker.coords.latitude+","+$scope.marker.coords.longitude+"&amp;ll="+$scope.marker.coords.latitude+","+$scope.marker.coords.longitude+"'); else window.open('http://maps.google.com/maps?daddr="+$scope.marker.coords.latitude+","+$scope.marker.coords.longitude+"&amp;ll="+$scope.marker.coords.latitude+","+$scope.marker.coords.longitude+"');}</script>";
                //$log.debug(mapsDevices);
                
                if(!_.isUndefined($scope.avisador.mensaje))
                    mensajeAdicional = $scope.avisador.mensaje;

                //$log.debug('googleUrl: '+googleUrl);
                //$log.debug('imgGoogleMaps: '+imgGoogleMaps);
                $scope.mensaje = "<!doctype html><html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'><head><!-- NAME: 1 COLUMN --><!--[if gte mso 15]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta charset='UTF-8'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta name='viewport' content='width=device-width, initial-scale=1'><title>*|MC:SUBJECT|*</title> <style type='text/css'>p{margin:10px 0;padding:0;}table{border-collapse:collapse;}h1,h2,h3,h4,h5,h6{display:block;margin:0;padding:0;}img,a img{border:0;height:auto;outline:none;text-decoration:none;}body,#bodyTable,#bodyCell{height:100%;margin:0;padding:0;width:100%;}#outlook a{padding:0;}img{-ms-interpolation-mode:bicubic;}table{mso-table-lspace:0pt;mso-table-rspace:0pt;}.ReadMsgBody{width:100%;}.ExternalClass{width:100%;}p,a,li,td,blockquote{mso-line-height-rule:exactly;}a[href^=tel],a[href^=sms]{color:inherit;cursor:default;text-decoration:none;}p,a,li,td,body,table,blockquote{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%;}a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important;}#bodyCell{padding:10px;}.templateContainer{max-width:600px !important;}a.mcnButton{display:block;}.mcnImage{vertical-align:bottom;}.mcnTextContent{word-break:break-word;}.mcnTextContent img{height:auto !important;}.mcnDividerBlock{table-layout:fixed !important;}body,#bodyTable{background-color:#FAFAFA;}#bodyCell{border-top:0;}.templateContainer{border:0;}h1{color:#202020;font-family:Helvetica;font-size:26px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal;text-align:left;}h2{color:#202020;font-family:Helvetica;font-size:22px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal;text-align:left;}h3{color:#202020;font-family:Helvetica;font-size:20px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal;text-align:left;}h4{color:#202020;font-family:Helvetica;font-size:18px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal;text-align:left;}#templatePreheader{background-color:#FAFAFA;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:9px;}#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{color:#656565;font-family:Helvetica;font-size:12px;line-height:150%;text-align:left;}#templatePreheader .mcnTextContent a,#templatePreheader .mcnTextContent p a{color:#656565;font-weight:normal;text-decoration:underline;}#templateHeader{background-color:#FFFFFF;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:0;}#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{color:#202020;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left;}#templateHeader .mcnTextContent a,#templateHeader .mcnTextContent p a{color:#2BAADF;font-weight:normal;text-decoration:underline;}#templateBody{background-color:#FFFFFF;border-top:0;border-bottom:2px solid #EAEAEA;padding-top:0;padding-bottom:9px;}#templateBody .mcnTextContent,#templateBody .mcnTextContent p{color:#202020;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left;}#templateBody .mcnTextContent a,#templateBody .mcnTextContent p a{color:#2BAADF;font-weight:normal;text-decoration:underline;}#templateFooter{background-color:#FAFAFA;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:9px;}#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{color:#656565;font-family:Helvetica;font-size:12px;line-height:150%;text-align:center;}#templateFooter .mcnTextContent a,#templateFooter .mcnTextContent p a{color:#656565;font-weight:normal;text-decoration:underline;}@media only screen and (min-width:768px){.templateContainer{width:600px !important;}}@media only screen and (max-width: 480px){body,table,td,p,a,li,blockquote{-webkit-text-size-adjust:none !important;}}@media only screen and (max-width: 480px){body{width:100% !important;min-width:100% !important;}}@media only screen and (max-width: 480px){#bodyCell{padding-top:10px !important;}}@media only screen and (max-width: 480px){.mcnImage{width:100% !important;}}@media only screen and (max-width: 480px){.mcnCaptionTopContent,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer{max-width:100% !important;width:100% !important;}}@media only screen and (max-width: 480px){.mcnBoxedTextContentContainer{min-width:100% !important;}}@media only screen and (max-width: 480px){.mcnImageGroupContent{padding:9px !important;}}@media only screen and (max-width: 480px){.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{padding-top:9px !important;}}@media only screen and (max-width: 480px){.mcnImageCardTopImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{padding-top:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardBottomImageContent{padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockInner{padding-top:0 !important;padding-bottom:0 !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockOuter{padding-top:9px !important;padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnTextContent,.mcnBoxedTextContentColumn{padding-right:18px !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{padding-right:18px !important;padding-bottom:0 !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcpreview-image-uploader{display:none !important;width:100% !important;}}@media only screen and (max-width: 480px){h1{font-size:22px !important;line-height:125% !important;}}@media only screen and (max-width: 480px){h2{font-size:20px !important;line-height:125% !important;}}@media only screen and (max-width: 480px){h3{font-size:18px !important;line-height:125% !important;}}@media only screen and (max-width: 480px){h4{font-size:16px !important;line-height:150% !important;}}@media only screen and (max-width: 480px){.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{font-size:14px !important;line-height:150% !important;}}@media only screen and (max-width: 480px){#templatePreheader{display:block !important;}}@media only screen and (max-width: 480px){#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{font-size:14px !important;line-height:150% !important;}}@media only screen and (max-width: 480px){#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{font-size:16px !important;line-height:150% !important;}}@media only screen and (max-width: 480px){#templateBody .mcnTextContent,#templateBody .mcnTextContent p{font-size:16px !important;line-height:150% !important;}}@media only screen and (max-width: 480px){#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{font-size:14px !important;line-height:150% !important;}}</style></head> <body style='height: 100%;margin: 0;padding: 0;width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FAFAFA;'> <center> <table align='center' border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #FAFAFA;'> <tr> <td align='center' valign='top' id='bodyCell' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;'> <!-- BEGIN TEMPLATE // --><!--[if gte mso 9]><table align='center' border='0' cellspacing='0' cellpadding='0' width='600' style='width:600px;'><tr><td align='center' valign='top' width='600' style='width:600px;'><![endif]--> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='templateContainer' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;border: 0;max-width: 600px !important;'> <tr> <td valign='top' id='templatePreheader' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FAFAFA;border-top: 0;border-bottom: 0;padding-top: 9px;padding-bottom: 9px;'></td> </tr> <tr> <td valign='top' id='templateHeader' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FFFFFF;border-top: 0;border-bottom: 0;padding-top: 9px;padding-bottom: 0;'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnTextBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody class='mcnTextBlockOuter'> <tr> <td valign='top' class='mcnTextBlockInner' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <table align='left' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnTextContentContainer'> <tbody><tr> <td valign='top' class='mcnTextContent' style='padding-top: 9px;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;'> Tu querido amigo/familia/conocido <span style='color:#008000'><strong>"+$scope.user.username+" </strong></span>ha planeado salir a hacer unas fotos y ha tenido la consideración de avisarte para que sepas donde estará durante su salida. Ahí van los detalles del lugar:<ul><li style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'><strong>Lugar</strong>: "+$scope.avisador.donde+"</li><li style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'><strong>Fecha</strong>: "+moment($scope.avisador.fecha).format('DD/MM/YYYY')+"</li><li style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'><strong>Hora de salida (estimada):</strong> "+moment($scope.avisador.horaSalida).format('hh:mm A')+"</li><li style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'><strong>Hora de llegada (estimada):</strong> "+moment($scope.avisador.horaLlegada).format('hh:mm A')+"</li><li style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'><strong>Mensaje adicional: </strong>"+mensajeAdicional+"</li></ul> </td> </tr> </tbody></table> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnImageBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody class='mcnImageBlockOuter'> <tr> <td valign='top' style='padding: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnImageBlockInner'> <table align='left' width='100%' border='0' cellpadding='0' cellspacing='0' class='mcnImageContentContainer' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td class='mcnImageContent' valign='top' style='padding-right: 9px;padding-left: 9px;padding-top: 0;padding-bottom: 0;text-align: center;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <a href='"+googleUrl+"' title='' class='' target='_blank' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <img align='center' alt='' src='"+imgGoogleMaps+"' width='564' style='max-width: 601px;padding-bottom: 0;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;' class='mcnImage'> </a> </td> </tr> </tbody></table> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnCodeBlock' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody class='mcnTextBlockOuter'> <tr> <td valign='top' class='mcnTextBlockInner' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnTextBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody class='mcnTextBlockOuter'> <tr> <td valign='top' class='mcnTextBlockInner' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <table align='left' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnTextContentContainer'> <tbody><tr> <td valign='top' class='mcnTextContent' style='padding-top: 9px;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;'>Dentro  de poco estaré de vuelta y te podré enseñar todas las fotos que hice :)</td> </tr> </tbody></table> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnDividerBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;table-layout: fixed !important;'> <tbody class='mcnDividerBlockOuter'> <tr> <td class='mcnDividerBlockInner' style='min-width: 100%;padding: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <table class='mcnDividerContent' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-top-width: 2px;border-top-style: solid;border-top-color: #EAEAEA;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <span></span> </td> </tr> </tbody></table><!-- <td class='mcnDividerBlockInner' style='padding: 18px;'> <hr class='mcnDividerContent' style='border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;' />--> </td> </tr> </tbody></table></td> </tr> <tr> <td valign='top' id='templateBody' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FFFFFF;border-top: 0;border-bottom: 2px solid #EAEAEA;padding-top: 0;padding-bottom: 9px;'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnTextBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody class='mcnTextBlockOuter'> <tr> <td valign='top' class='mcnTextBlockInner' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <table align='left' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnTextContentContainer'> <tbody><tr> <td valign='top' class='mcnTextContent' style='padding-top: 9px;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;'> Sistema de avisos a cargo de<a href='http://www.subexpuesta.com' target='_blank' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #2BAADF;font-weight: normal;text-decoration: underline;'> www.subexpuesta.com</a><br><br>Este es un servicio <span style='color:#800080'><strong>gratuito </strong></span>y libre de publicidad, por lo que si piensas que puede servirte de utilidad y puede <span style='color:#0000FF'><strong>ayudar a la comunidad</strong></span> de fotógrafos, sería de gran ayuda para nosotros poder contar con tu colaboración.<br>Mil gracias de antemano. </td> </tr> </tbody></table> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnImageBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody class='mcnImageBlockOuter'> <tr> <td valign='top' style='padding: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnImageBlockInner'> <table align='left' width='100%' border='0' cellpadding='0' cellspacing='0' class='mcnImageContentContainer' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td class='mcnImageContent' valign='top' style='padding-right: 9px;padding-left: 9px;padding-top: 0;padding-bottom: 0;text-align: center;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <a href='http://www.subexpuesta.com/donaciones' title='' class='' target='_blank' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <img align='center' alt='' src='https://gallery.mailchimp.com/200f5dddbe9112ab8d21e9c28/images/c95e0b97-1375-4730-84ea-74d2b8ec9560.png' width='200' style='max-width: 200px;padding-bottom: 0;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;' class='mcnImage'> </a> </td> </tr> </tbody></table> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnTextBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody class='mcnTextBlockOuter'> <tr> <td valign='top' class='mcnTextBlockInner' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <table align='left' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnTextContentContainer'> <tbody><tr> <td valign='top' class='mcnTextContent' style='padding-top: 9px;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;'> </td> </tr> </tbody></table> </td> </tr> </tbody></table></td> </tr> <tr> <td valign='top' id='templateFooter' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FAFAFA;border-top: 0;border-bottom: 0;padding-top: 9px;padding-bottom: 9px;'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody class='mcnFollowBlockOuter'> <tr> <td align='center' valign='top' style='padding: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnFollowBlockInner'> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowContentContainer' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td align='center' style='padding-left: 9px;padding-right: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnFollowContent'> <tbody><tr> <td align='center' valign='top' style='padding-top: 9px;padding-right: 9px;padding-left: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <table align='center' border='0' cellpadding='0' cellspacing='0' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td align='center' valign='top' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <!--[if mso]> <table align='center' border='0' cellspacing='0' cellpadding='0'> <tr> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' style='display: inline;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td valign='top' style='padding-right: 10px;padding-bottom: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnFollowContentItemContainer'> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowContentItem' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td align='left' valign='middle' style='padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <table align='left' border='0' cellpadding='0' cellspacing='0' width='' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td align='center' valign='middle' width='24' class='mcnFollowIconContent' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <a href='https://twitter.com/subexpuesta_com' target='_blank' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-twitter-48.png' style='display: block;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;' height='24' width='24' class=''></a> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' style='display: inline;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td valign='top' style='padding-right: 10px;padding-bottom: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnFollowContentItemContainer'> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowContentItem' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td align='left' valign='middle' style='padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <table align='left' border='0' cellpadding='0' cellspacing='0' width='' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td align='center' valign='middle' width='24' class='mcnFollowIconContent' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <a href='https://www.facebook.com/subexpuesta/' target='_blank' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-facebook-48.png' style='display: block;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;' height='24' width='24' class=''></a> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' style='display: inline;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td valign='top' style='padding-right: 10px;padding-bottom: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnFollowContentItemContainer'> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowContentItem' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td align='left' valign='middle' style='padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <table align='left' border='0' cellpadding='0' cellspacing='0' width='' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td align='center' valign='middle' width='24' class='mcnFollowIconContent' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <a href='https://www.instagram.com/subexpuesta_com/' target='_blank' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-instagram-48.png' style='display: block;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;' height='24' width='24' class=''></a> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' style='display: inline;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td valign='top' style='padding-right: 0;padding-bottom: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' class='mcnFollowContentItemContainer'> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowContentItem' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td align='left' valign='middle' style='padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <table align='left' border='0' cellpadding='0' cellspacing='0' width='' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <tbody><tr> <td align='center' valign='middle' width='24' class='mcnFollowIconContent' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'> <a href='http://www.subexpuesta.com/' target='_blank' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-link-48.png' style='display: block;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;' height='24' width='24' class=''></a> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr></tbody></table> </td> </tr> </tbody></table></td> </tr> </table><!--[if gte mso 9]></td></tr></table><![endif]--> <!-- // END TEMPLATE --> </td> </tr> </table> </center> <center> <style type='text/css'> @media only screen and (max-width: 480px){ table[id='canspamBar'] td{font-size:14px !important;} table[id='canspamBar'] td a{display:block !important; margin-top:10px !important;} } </style> </center></body></html>";
                $scope.enviando = true;
                $scope.direccion = destinatariosString;


                
            /*<a href='https://www.google.com/maps?q="+$scope.marker.coords.longitude+"+"+$scope.marker.coords.latitude+"&ll="+$scope.marker.coords.longitude+"+"+$scope.marker.coords.latitude+"' target='_blank'>
             <img align='center' alt='' src='https://maps.googleapis.com/maps/api/staticmap?center="+$scope.marker.coords.longitude+","+$scope.marker.coords.latitude+"&zoom=6&size=600x300&maptype=roadmap&markers="+$scope.marker.coords.longitude+","+$scope.marker.coords.latitude+"&key=AIzaSyAfYUAtiwSJdy2brPkcLzUvG_YZJ97vMOs' width='564' > 
             </a>*/


                Email.EmailEnviarContacto.enviarMailContacto({
                    organizador: $scope.direccion,
                    direccion: 'subexpuestaweb@gmail.com',
                    nombre: $scope.user.username,
                    asunto: "Aviso salida fotográfica",
                    mensaje: $scope.mensaje
                }, function(mensaje) {

                    //$log.debug('mensaje: '+JSON.stringify(mensaje));
                    if (mensaje.message === 'success') {
                        
                        $scope.mensajeExito = "Su mensaje ha sido enviado correctamente, en la mayor brevedad posible nos pondremos en contacto contigo.";
                        $scope.alumno = {};
                    } else {
                        $scope.mostrarError = true;
                    }
                    $scope.enviando = false;

                });

            });
        }
    });
