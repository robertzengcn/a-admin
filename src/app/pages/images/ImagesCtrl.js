/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.products')
      .controller('ImagesCtrl', ImagesCtrl);

  /** @ngInject */
  function ImagesCtrl($scope, $filter, editableOptions, editableThemes,ImagesService) {
// ProductService.getproductlist().then(function(result){
// //$scope.productlist=result;
// },function(error){
// console.log('error');
// }).then(function(result){

// });

  var ctrl = this;

  this.displayed = [];

  this.callServer = function callServer(tableState) {

    ctrl.isLoading = true;

    var pagination = tableState.pagination;

    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
    var number = pagination.number || 10;  // Number of entries showed per page.

    ImagesService.getimagelist(start, number, tableState).then(function (result) {
    	
    	if(result.status){   	

      ctrl.displayed = result.data;
      tableState.pagination.numberOfPages = result.recordsTotal;//set the number of pages so the pagination can update
      ctrl.isLoading = false;
     // console.log(ctrl.displayed);
      }
    });
  };      
  }

})();
