/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages.products')
    .controller('ProductsCtrl', ProductsCtrl);
    //ProductsCtrl.$inject = ['$scope', '$filter', 'editableOptions', 'editableThemes','ProductService','Cateloguelistmodel'];

  /** @ngInject */
  function ProductsCtrl($scope, $filter, editableOptions, editableThemes,ProductService) {
    // ProductService.getproductlist().then(function(result){
    // //$scope.productlist=result;
    // },function(error){
    // console.log('error');
    // }).then(function(result){

    // });
    var mc=this;
    var ctrl = this;
    
    this.displayed = [];

    $scope.resultnum=0;

    this.callServer = function callServer(tableState) {

      ctrl.isLoading = true;

      var pagination = tableState.pagination;

      var start = pagination.start || 0; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      var number = pagination.number || 10; // Number of entries showed per page.
      var catelogue=$scope.master_categories_id;
      ProductService.getproductlist(start, number, tableState,catelogue).then(function(result) {

        if (result.status) {
          // for (var key in result.data) {
          // result.data[key].choose = false;
          //   }

          ctrl.displayed = result.data;

          tableState.pagination.numberOfPages = Math.ceil(result.recordsTotal / number); //set the number of pages so the pagination can update
          ctrl.isLoading = false;
          $scope.resultnum=result.recordsFiltered;
          // console.log(ctrl.displayed);
        }
      });


    };
    /**
     * 删除某一行
     * @Author    Robert      Zeng
     * @DateTime  2018-07-23
     * @copyright [copyright]
     * @license   [license]
     * @version   [version]
     * @param     {[type]}    row  [description]
     * @return    {[type]}         [description]
     */
    this.removeitem = function(row) {
      console.log('delete');
      var indexs = ctrl.displayed.indexOf(row);
      if (indexs === -1) {
        return;
      }
      layer.confirm('are you sure to delete?', function(index) {
        layer.load(1);
        ProductService.deleteproduct(row.products_id).then(function(result) {
          layer.closeAll('loading');
          if (result.status) {
            layer.msg('delete success');
            ctrl.refreshGrid();
            //ctrl.displayed.splice(indexs, 1);
          } else {
            layer.alert(result.msg);
          }
        });
        layer.close(index);
      });
    };
    /**
     * 批量删除数据
     * @Author    Robert      Zeng
     * @DateTime  2018-07-19
     * @copyright [copyright]
     * @license   [license]
     * @version   [version]
     * @return    {[type]}    [description]
     */
    this.deletebatchitem = function() {
      if (!ctrl.selected || ctrl.selected.length < 1) {
        return;
      }

      layer.confirm('are you sure to delete?', function(index) {
        layer.load(1);
        console.log(ctrl.selected);
        ProductService.batchdelete(ctrl.selected).then(function(result) {
          layer.closeAll('loading');
          if (result.status) {
            layer.msg('delete success');
            ctrl.refreshGrid();
            //console.log(ctrl.displayed);
            //angular.forEach(ctrl.displayed, function(val,key) {
            // for (var i = ctrl.displayed.length - 1; i >= 0; i--) {

            //   if (ctrl.selected.includes(ctrl.displayed[i].products_id)) {
            //     console.log(i);
            //     ctrl.displayed.splice(i, 1);
            //   }
            // }
            // });

          } else {
            layer.alert(result.msg);
          }
        });
      });
    };

    this.toggleAll = function() {
      for (var key in ctrl.displayed) {
        console.log(ctrl.displayed[key]);
      }
    };

    this.selected = [];
    // Function to get data for all selected items
    this.selectAll = function(collection) {

      // if there are no items in the 'selected' array, 
      // push all elements to 'selected'
      if (ctrl.selected.length === 0) {

        angular.forEach(collection, function(val) {

          ctrl.selected.push(val.products_id);

        });

        // if there are items in the 'selected' array, 
        // add only those that ar not
      } else if (ctrl.selected.length > 0 && ctrl.selected.length != ctrl.displayed.length) {

        angular.forEach(collection, function(val) {

          var found = ctrl.selected.indexOf(val.products_id);

          if (found == -1) ctrl.selected.push(val.products_id);

        });

        // Otherwise, remove all items
      } else {

        ctrl.selected = [];

      }

    };

    // Function to get data by selecting a single row
    this.select = function(id) {

      var found = ctrl.selected.indexOf(id);

      if (found == -1) ctrl.selected.push(id);

      else ctrl.selected.splice(found, 1);

    };
    /**
     * reflash table
     * @Author    Robert      Zeng
     * @DateTime  2018-07-24
     * @copyright [copyright]
     * @license   [license]
     * @version   [version]
     * @return    {[type]}    [description]
     */
 

    this.refreshGrid = function() {
      $scope.$broadcast('refreshProducts');
    };
    /**
     * 获取目录
     * @Author    Robert      Zeng
     * @DateTime  2018-07-26
     * @copyright [copyright]
     * @license   [license]
     * @version   [version]
     * @return    {[type]}    [description]
     */
    this.getcatelist=function(){
      ProductService.getcateloguelist().then(function(result) {
         
          if (result.status) {
             $scope.cateloguelist=result.data;
             console.log($scope.cateloguelist);
             // if(!$scope.master_categories_id){//赋予默认
             //  $scope.master_categories_id=$scope.cateloguelist[0].categories_id;
             // }
            //ctrl.displayed.splice(indexs, 1);
          } else {
            layer.alert(result.msg);
          }
        });
      
    };
    
    this.getcatelist();



  }

})();