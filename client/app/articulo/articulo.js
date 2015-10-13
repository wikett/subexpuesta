'use strict';

angular.module('subexpuestaV2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('articulo', {
        url: '/articulo',
        templateUrl: 'app/articulo/articulo.html',
        controller: 'ArticuloCtrl'
      })
      .state('blog', {
        url: '/blog',
        templateUrl: 'app/articulo/lista-articulos.html',
        controller: 'ListaArticulosCtrl'
      })
      .state('blogcategoria', {
        url: '/blog/:categoria',
        templateUrl: 'app/articulo/lista-articulos.html',
        controller: 'ListaArticulosCtrl'
      })
      .state('creararticulo', {
        url: '/admin/crear-articulo',
        templateUrl: 'app/articulo/admin/crear-articulo.html',
        controller: 'CrearArticuloCtrl',
        authenticate: true
      })
      .state('listadoarticulos', {
        url: '/admin/listado-articulos',
        templateUrl: 'app/articulo/admin/lista-articulos.html',
        controller: 'AdminListaArticulosCtrl',
        authenticate: true
      })
      .state('modificararticulos', {
        url: '/admin/modificar-articulos/:id/',
        templateUrl: 'app/articulo/admin/modificar-articulo.html',
        controller: 'AdminModificarArticulosCtrl',
        authenticate: true
      })
      .state('singlearticulo', {
        url: '/articulo/:id/:titulo',
        templateUrl: 'app/articulo/single-articulo.html',
        controller: 'SingleArticuloCtrl'
      });
  });