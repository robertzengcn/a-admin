/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.products')
      .controller('ProductsCtrl', ProductsCtrl);

  /** @ngInject */
  function ProductsCtrl($scope, $filter, editableOptions, editableThemes,ProductService) {
ProductService.getproductlist();
      

  }

})();
