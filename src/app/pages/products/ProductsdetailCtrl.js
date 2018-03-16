/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.products')
      .controller('ProductsdetailCtrl', ProductsdetailCtrl);

  /** @ngInject */
  function ProductsdetailCtrl($scope, $filter, editableOptions, editableThemes,ProductService,productmodels,cateloguelist) {

$scope.detail=productmodels.data;

$scope.cateloguelist = cateloguelist.data;



     
  }

})();
