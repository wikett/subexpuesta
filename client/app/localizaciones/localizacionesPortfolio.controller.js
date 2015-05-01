'use strict';

angular.module('subexpuestaV2App')
  .controller('LocalizacionesPortfolioCtrl', function ($scope, $log, Localizacion, $stateParams, $filter) {
    
    $scope.listaLocalizaciones = {};

  /*function getLocalizaciones(){
      


      $scope.listaLocalizaciones = Localizacion.LocalizacionAutor.getByAutor({autor:'wikett'},function());

    };*/
$log.debug('seo: '+$filter('seo')('mi titulo españa´s people ahí es na!'));

getLocalizaciones();
//$scope.findByAutor();
      
function getLocalizaciones() {
            //console.log('findByTitle(): ' + $stateParams.apunteTitulo);
            Localizacion.LocalizacionAutor.getByAutor({
                autor: $stateParams.autor
            }, function(localizaciones) {
                $scope.listaLocalizaciones = localizaciones;
            });


        };
      

    })