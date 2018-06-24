/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.images', [
    'angularFileUpload',
    'ngFileUpload'
    ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('images', {
          url: '/images',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          controller: 'ImagesCtrl',
          title: 'Images Manager',
          sidebarMeta: {
            icon: 'ion-android-home',
            order: 1,
          },
        }).state('images.list', {
          url: '/list',
          templateUrl: 'app/pages/images/smart/tables.html',
          title: 'List',
          sidebarMeta: {
            order: 100,
          },
        });
         $urlRouterProvider.when('/images','/images/list');
  }

})();
