'use strict';

angular.module('subexpuestaV2App')
  .controller('SiteMapCtrl', function ($scope, $rootScope) {
  	$scope.isLoggedIn = Auth.isLoggedIn;

 

 $rootScope.title = 'Sitemap | subexpuesta.com';
 $rootScope.metaDescription = 'Organización de todos los enlaces de la web.';


  });
