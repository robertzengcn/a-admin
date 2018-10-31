/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages.workers')
    .controller('WorkersCtrl', WorkersCtrl);

  /** @ngInject */
  function WorkersCtrl($scope, $filter, editableOptions, editableThemes, WorkerService) {
    var ctrl = this;

    this.displayed = [];

    this.callServer = function callServer(tableState) {

      ctrl.isLoading = true;

      var pagination = tableState.pagination;

      var start = pagination.start || 0; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      var number = pagination.number || 10; // Number of entries showed per page.

      WorkerService.getworkerlist(start, number, tableState).then(function(result) {

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
    /**
     * 删除某一行
     * @Author    ZhangYuanyuan
     * @DateTime  2018-07-28
     * @param     {[type]}    row  [description]
     * @return    {[type]}         [description]
     */
    this.removeitem = function(row) {
      var indexs = ctrl.displayed.indexOf(row);
      if (indexs === -1) {
        return;
      }
      layer.confirm('are you sure to delete?', function(index) {
        layer.load(1);
        WorkerService.deleteworker(row.id).then(function(result) {
          layer.closeAll('loading');
          if (result.status) {
            layer.msg('delete success');
            ctrl.refreshGrid();
          } else {
            layer.alert(result.msg);
          }
        });
        layer.close(index);
      });
    };
    /**
     * 批量删除数据
     * @Author    ZhangYuanyuan
     * @DateTime  2018-07-29
     */
    this.deletebatchitem = function() {
      if (!ctrl.selected || ctrl.selected.length < 1) {
        return;
      }

      layer.confirm('are you sure to delete?', function(index) {
        layer.load(1);
        console.log(ctrl.selected);
        WorkerService.batchdelete(ctrl.selected).then(function(result) {
          layer.closeAll('loading');
          if (result.status) {
            layer.msg('delete success');
            ctrl.refreshGrid();

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

          ctrl.selected.push(val.id);

        });

        // if there are items in the 'selected' array, 
        // add only those that ar not
      } else if (ctrl.selected.length > 0 && ctrl.selected.length != ctrl.displayed.length) {

        angular.forEach(collection, function(val) {

          var found = ctrl.selected.indexOf(val.id);

          if (found == -1) ctrl.selected.push(val.id);

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
     * @Author    ZhangYuanyuan
     * @DateTime  2018-07-29
     */
    this.refreshGrid = function() {
      $scope.$broadcast('refreshWorkers');
    };

    /**
     * 重置密码
     * */
    this.resetpwd = function(row) {
        console.log('resetPwd');
        var indexs = ctrl.displayed.indexOf(row);
        if (indexs === -1) {
          return;
        }
        layer.confirm('are you sure to reset the password?', function(index) {
          layer.load(1);
          WorkerService.resetpwd(row.id).then(function(result) {
            layer.closeAll('loading');
            if (result.status) {
              layer.msg('reset password success');
              ctrl.refreshGrid();
            } else {
              layer.alert(result.msg);
            }
          });
          layer.close(index);
        });
    };
  }

})();