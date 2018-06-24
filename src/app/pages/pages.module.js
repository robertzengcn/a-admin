/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  var bluradmin = angular.module('BlurAdmin.pages', [
      'ui.router',
      'ngStorage',
      'BlurAdmin.pages.dashboard',
      'BlurAdmin.pages.products',
      'BlurAdmin.pages.images',
      'BlurAdmin.pages.ui',
      'BlurAdmin.pages.components',
      'BlurAdmin.pages.form',
      'BlurAdmin.pages.tables',
      'BlurAdmin.pages.charts',
      'BlurAdmin.pages.maps',
      'BlurAdmin.pages.profile',

    ])
    .config(routeConfig);
  bluradmin.run(function($rootScope, $http, $state, $stateParams, $localStorage, $window) {
    var authtoken = $localStorage.auth;

    if (!authtoken) {
      $window.location.href = "/auth.html";
    }



    $http({
      method: "GET",
      url: "/env.json",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }).success(function(response) {
      $rootScope.app = response;
         $http({
      method: "GET",
      url: $rootScope.app.host+"/Auth/info",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':authtoken,
      },
    }).success(function(response) {
    if(response.status){
       $http.defaults.headers.common.Authorization = $localStorage.auth;
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    }else{
        $window.location.href = "/auth.html";
    }
    }); 
    });

   
  });

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/dashboard');

    baSidebarServiceProvider.addStaticItem({
      title: 'Pages',
      icon: 'ion-document',
      subMenu: [{
        title: 'Sign In',
        fixedHref: 'auth.html',
        blank: true
      }, {
        title: 'Sign Up',
        fixedHref: 'reg.html',
        blank: true
      }, {
        title: 'User Profile',
        stateRef: 'profile'
      }, {
        title: '404 Page',
        fixedHref: '404.html',
        blank: true
      }, {
        title: 'Products',
        fixedHref: '/#/products',
        blank: true
      }]
    });
    baSidebarServiceProvider.addStaticItem({
      title: 'Menu Level 1',
      icon: 'ion-ios-more',
      subMenu: [{
        title: 'Menu Level 1.1',
        disabled: true
      }, {
        title: 'Menu Level 1.2',
        subMenu: [{
          title: 'Menu Level 1.2.1',
          disabled: true
        }]
      }, {
        title: 'Products',
        stateRef: 'products',
        fixedHref: './reg.html',
      }]
    });
  }

})();