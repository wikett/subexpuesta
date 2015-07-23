'use strict';

angular.module('subexpuestaV2App')
  .controller('LocalizacionesPortfolioCtrl', function ($scope, $rootScope, $log, Localizacion, $stateParams, $filter, Auth, Usuario) {
               
    $scope.listaLocalizaciones = {};
    $rootScope.title = 'Localizaciones de Fotografias Nocturnas por: '+$stateParams.autor;
    $rootScope.metaDescription = 'Porfolio con las localizaciones de fotografia nocturna compartidas por '+$stateParams.autor;
   
    $scope.getCurrentUser = Auth.getCurrentUser();

    $scope.sitioweb = '';
    $scope.sitioFB = '';
    $scope.sitioTwitter = '';
    $scope.usuarioSub = '';

getUsuario();
getLocalizaciones();

function getUsuario(){

     Usuario.getportitulo({
                username: $stateParams.autor
            }, function(usuario) {
                if(!_.isNull(usuario))
                {
                    $scope.nombreUsuario =  usuario.username;
                    $scope.sitioweb = usuario.web;
                    $scope.sitioFB = usuario.urlFacebook;
                    $scope.sitioTwitter = usuario.urlTwitter;

                    if(!_.isUndefined($scope.sitioweb) && $scope.sitioweb.length>0)
                        if($scope.sitioweb.indexOf("http")>=0)
                        {
                            $scope.sitioweb = $scope.sitioweb;        
                        }
                        else
                        {
                            $scope.sitioweb = "http://"+$scope.sitioweb;           
                        }

                        if(!_.isUndefined($scope.sitioFB) && $scope.sitioFB.length>0)
                        if($scope.sitioFB.indexOf("http")>=0)
                        {
                            $scope.sitioFB = $scope.sitioFB;        
                        }
                        else
                        {
                            $scope.sitioFB = "https://"+$scope.sitioFB;           
                        }
                        if(!_.isUndefined($scope.sitioTwitter) && $scope.sitioTwitter.length>0)
                        if($scope.sitioTwitter.indexOf("http")>=0)
                        {
                            $scope.sitioTwitter = $scope.sitioTwitter;        
                        }
                        else
                        {
                            $scope.sitioTwitter = "https://"+$scope.sitioTwitter;           
                        }
                }
            });
};
      
function getLocalizaciones() {
            Localizacion.LocalizacionAutor.getByAutor({
                autor: $stateParams.autor
            }, function(localizaciones) {
                $scope.listaLocalizaciones = localizaciones;
            });


        };
      

    })