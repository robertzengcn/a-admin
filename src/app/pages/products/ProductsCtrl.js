/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.products')
      .controller('ProductsCtrl', ProductsCtrl);

    /** @ngInject */
    function ProductsCtrl($scope, $filter, editableOptions, editableThemes, ProductService) {
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

        var start = pagination.start || 0; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        var number = pagination.number || 10; // Number of entries showed per page.

        ProductService.getproductlist(start, number, tableState).then(function(result) {

            if (result.status) {
              // for (var key in result.data) {
              // result.data[key].choose = false;
              //   }

                ctrl.displayed = result.data;

                tableState.pagination.numberOfPages = Math.ceil(result.recordsTotal / number); //set the number of pages so the pagination can update
                ctrl.isLoading = false;
                // console.log(ctrl.displayed);
              }
            });


        };
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
                ctrl.displayed.splice(indexs, 1);
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
        this.deleteitem = function() {

        };
        
       this.toggleAll = function() {
          for (var key in ctrl.displayed) {
            console.log(ctrl.displayed[key]);
         }
        };
      }

    })();