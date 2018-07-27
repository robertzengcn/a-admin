/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.products', [
    'ng.ueditor',
    'angularFileUpload',
    'ngFileUpload'
    ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('products', {
          url: '/products',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          //controller: 'ProductsCtrl',
          title: 'Products',
          sidebarMeta: {
            icon: 'fa fa fa-anchor',
            order: 1,
          },
        }).state('products.list', {
          url: '/list',
          templateUrl: 'app/pages/products/smart/tables.html',
          title: 'List',
          sidebarMeta: {
            order: 100,
          },
         // controller: 'ProductsCtrl'
       
        }).state('products.detail', {
          url: '/detail/:id',
          templateUrl: 'app/pages/products/widgets/productDetail.html',
          title: 'Detail',
          controller: 'ProductsdetailCtrl', 
          resolve: {
            productmodels:function($stateParams,ProductService){
              return ProductService.getproduct($stateParams.id);
            },
            cateloguelist:function(ProductService){
              return ProductService.getcateloguelist();
            }
          }       
        }).state('products.create',{
          url: '/create/', 
          templateUrl: 'app/pages/products/widgets/productDetail.html',
          title: 'Create Product',
            sidebarMeta: {
            order: 110,
          },
          controller: 'ProductsdetailCtrl',
          resolve: {
            productmodels:function($stateParams,ProductService){
             return ProductService.getproductmodel();
            },
            cateloguelist:function(ProductService){
              return ProductService.getcateloguelist();
            }
          } 
        });
         $urlRouterProvider.when('/products','/products/list');
  }

})();
