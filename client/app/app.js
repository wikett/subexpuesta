'use strict';

angular.module('subexpuestaV2App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ui.router',
  'ui.bootstrap',
  'ngImgCrop',
  'cloudinary',
  'angularFileUpload',
  'uiGmapgoogle-maps',
  'ngTagsInput'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, uiGmapGoogleMapApiProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $.cloudinary.config().cloud_name = 'djhqderty';
    $.cloudinary.config().upload_preset = 'jtzexgjp';

   uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,places,geometry,visualization'
    });

  
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        //console.log('$httpProvider.defaults.headers: '+$cookieStore.get('token'));
        //console.log('config.url.indexOf(api.cloudinary.com): '+config.url.indexOf('api.cloudinary.com'));
        if ($cookieStore.get('token') && config.url.indexOf('api.cloudinary.com')===-1) {
          //console.log('ENTRO aqui');
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        //console.log('config: '+JSON.stringify(config));
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, $window) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      $window.scrollTo(0,0);
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });

    
    //console.log('Reseteo rootScope.title');
    $rootScope.title = '';
    $rootScope.metaDescription = '';
    $rootScope.titleFB = '';
    $rootScope.descriptionFB = '';
    $rootScope.imageFB = 'http://www.subexpuesta.com/assets/images/subexpuesta-logo.png';

  });