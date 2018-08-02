/**
 * @author v.lugovsky
 * created on 23.12.2015
 */
(function() {
  'use strict';

  /**
   * Represents current element as panel, adding all necessary classes.
   */
  angular.module('BlurAdmin.service')
    .factory('WorkerService', ["$q", "$http", "$localStorage", function($q, $http, $localStorage) {
      var apphost = $localStorage.host;
      
      /**
       * 列表
       * */
      var getworkerlist = function(start, number, params) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var progress;
        start = start || 0;
        number = number || 10;
        var serarkey = '';
        if (params.search.predicateObject) {
          serarkey = params.search.predicateObject.$;
        }

        var sortkey = '';
        console.log(params.sort);
        if (params.sort.predicate) {


          sortkey = params.sort.predicate;

        }
        var sortway = '';
        if (params.sort.reverse) {
          sortway = 'desc';
        } else {
          sortway = 'asc';
        }

        var data = $.param({
          start: start,
          length: number,
          search: serarkey,
          sort: sortkey,
          sortway: sortway
        });


        var config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
          }
        };
        $http.post(apphost + "/workers/getlist/", data)
          .success(function(data) {
            // var result = [];
            // for(var i = 0; i < data.length; i++){
            //     result.push(data[i].user);
            //     progress = (i+1)/data.length * 100;
            //     deferred.notify(progress);
            // }
            deferred.resolve(
              data
            );
          })
          .error(function(error) {
            deferred.reject(error);
          });
        return promise;

      };
      
      /**
       * 组列表
       * */
      var getgrouplist = function(start, number, params) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var progress;
        start = start || 0;
        number = number || 10;
        var serarkey = '';
        if (params.search.predicateObject) {
          serarkey = params.search.predicateObject.$;
        }

        var sortkey = '';
        if (params.sort.predicate) {


          sortkey = params.sort.predicate;

        }
        var sortway = '';
        if (params.sort.reverse) {
          sortway = 'desc';
        } else {
          sortway = 'asc';
        }

        var data = $.param({
          start: start,
          length: number,
          search: serarkey,
          sort: sortkey,
          sortway: sortway
        });


        var config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
          }
        };
        $http.post(apphost + "/workers/getgrouplist/", data)
          .success(function(data) {
            deferred.resolve(
              data
            );
          })
          .error(function(error) {
            deferred.reject(error);
          });
        return promise;

      };
      
      /**
       * 获取管理员信息
       * */
      var getworker = function(id) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var data = $.param({
          id: id
        });

        $http.post(apphost + "/workers/getdetail/", data)
          .success(function(data) {
            // var result = [];
            // for(var i = 0; i < data.length; i++){
            //     result.push(data[i].user);
            //     progress = (i+1)/data.length * 100;
            //     deferred.notify(progress);
            // }
            deferred.resolve(
              data
            );
          })
          .error(function(error) {
            deferred.reject(error);
          });
        return promise;

      };
      
      /**
       * 获取管理员类型
       * */
      var getworkertypelist = function() {
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(apphost + "/workers/getworkertypelist/")
          .success(function(data) {
            deferred.resolve(
              data
            );
          })
          .error(function(error) {
            deferred.reject(error);
          });
        return promise;

      };
      
      /**
       * 获取组信息
       * */
      var getworkergroup = function(id) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var data = $.param({
          id: id
        });

        $http.post(apphost + "/workers/getgroupdetail/", data)
          .success(function(data) {
            // var result = [];
            // for(var i = 0; i < data.length; i++){
            //     result.push(data[i].user);
            //     progress = (i+1)/data.length * 100;
            //     deferred.notify(progress);
            // }
            deferred.resolve(
              data
            );
          })
          .error(function(error) {
            deferred.reject(error);
          });
        return promise;

      };
      
      /**
       * 获取所有组信息
       * */
      var getallgroups = function() {
          var deferred = $q.defer();
          var promise = deferred.promise;

          $http.post(apphost + "/workers/getallgroups/")
            .success(function(data) {
              deferred.resolve(
                data
              );
            })
            .error(function(error) {
              deferred.reject(error);
            });
          return promise;

        };
        
      /**
       * 获取模型
       * */
      var getworkermodel = function() {
        var model = {};
        model.data = {};
        return model;
      };
      
      /**
       * 单个删除
       * */
      var deleteworker = function(id) {

        var deferred = $q.defer();
        var promise = deferred.promise;
        var data = $.param({
          id: id
        });
        console.log(id);
        $http.delete(apphost + "/workers/delete/id/"+id)
          .success(function(data) {
            deferred.resolve(
              data
            );
          })
          .error(function(error) {
            deferred.reject(error);
          });
        return promise;
      };
      
      /**
       * 单个删除组
       * */
      var deletegroup = function(id) {

        var deferred = $q.defer();
        var promise = deferred.promise;
        var data = $.param({
          id: id
        });
        console.log(id);
        $http.delete(apphost + "/workers/deletegroup/id/"+id)
          .success(function(data) {
            deferred.resolve(
              data
            );
          })
          .error(function(error) {
            deferred.reject(error);
          });
        return promise;
      };
      
      /**
       * 批量删除
       * @Author   ZhangYuanyuan
       * @DateTime  2018-07-28
       * @param     {[type]}    arr  [description]
       * @return    {[type]}         [description]
       */
      var batchdelete=function(arr){
        console.log(arr);
        var ids=JSON.stringify(arr);
        if(!ids){
          return;
        }
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.delete(apphost + "/workers/deletes/",{params: {'ids':ids}})
          .success(function(data) {
            deferred.resolve(
              data
            );
          })
          .error(function(error) {
            deferred.reject(error);
          });
        return promise;
      }
      
      /**
       * 重置密码
       * */
      var resetpwd = function(id) {
          var deferred = $q.defer();
          var promise = deferred.promise;

          $http.post(apphost + "/workers/resetpwd/id/" + id)
            .success(function(data) {
              deferred.resolve(
                data
              );
            })
            .error(function(error) {
              deferred.reject(error);
            });
          return promise;

        };
        
        /**
         * 获取所有有效菜单信息
         * */
        var getallmenus = function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(apphost + "/workers/getallmenus/")
              .success(function(data) {
                deferred.resolve(
                  data
                );
              })
              .error(function(error) {
                deferred.reject(error);
              });
            return promise;

          };
          
        /**
         * 获取组下管理菜单
         * */
        var getgroupmenus = function(group) {
        	var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(apphost + "/workers/getgroupmenus/group/" + group)
              .success(function(data) {
                deferred.resolve(
                  data
                );
              })
              .error(function(error) {
                deferred.reject(error);
              });
            return promise;
        };
        
      return {
        getworkerlist: getworkerlist,
        getworker: getworker,
        getworkertypelist: getworkertypelist,
        getworkermodel: getworkermodel,
        deleteworker:deleteworker,
        batchdelete:batchdelete,
        getallgroups: getallgroups,
        resetpwd: resetpwd,
        getallmenus: getallmenus,
        getgroupmenus: getgroupmenus,
        getgrouplist: getgrouplist,
        deletegroup: deletegroup,
        getworkergroup: getworkergroup,
      };

    }]);
})();