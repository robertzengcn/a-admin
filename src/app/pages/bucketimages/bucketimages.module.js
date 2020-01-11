/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.bucketimages', [
    ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('bucketimages', {
      url: '/bucketimages',
      template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
      abstract: true,
      controller: 'ImagesCtrl',
      title: 'Images Manager',
      sidebarMeta: {
        icon: 'fa fa fa-image',
        order: 1,
      },
    }).state('bucketimages.list', {
          url: '/list',
          templateUrl: 'app/pages/bucketimages/smart/tables.html',
          title: 'List',
          sidebarMeta: {
            order: 100,
          },
        });
         $urlRouterProvider.when('/images','/bucketimages/list');
  }

})();
