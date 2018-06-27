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
        }).state('images.detail', {
          url: '/detail/:id',
          templateUrl: 'app/pages/images/widgets/imagesDetail.html',
          title: 'Detail',
          controller: 'ImagesdetailCtrl', 
          resolve: {
            imagemodels:function($stateParams,ImagesService){
              
              return ImagesService.getimage($stateParams.id);
            },
          }       
        }).state('images.create',{
          url: '/create/', 
          templateUrl: 'app/pages/images/widgets/imagesDetail.html',
          title: 'Create images',
            sidebarMeta: {
            order: 110,
          },
          controller: 'ImagesdetailCtrl',
          resolve: {
            imagemodels:function($stateParams,ImagesService){
             return ImagesService.getimagesmodel();
            }
          } 
        });
         $urlRouterProvider.when('/images','/images/list');
  }

})();
