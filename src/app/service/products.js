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
    .factory('ProductService', ["$q", "$http", "$localStorage", function($q, $http, $localStorage) {
      var apphost = $localStorage.host;
      var getproductlist = function(start, number, params) {
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
        $http.post(apphost + "/products/getlist/", data)
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
      var getproduct = function(id) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var data = $.param({
          id: id
        });

        $http.post(apphost + "/products/getdetail/", data)
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
      var getcateloguelist = function() {
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(apphost + "/products/getcateloguelist/")
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
      var getproductmodel = function() {
        var model = {};
        model.data = {};
        return model;
      };
      var deleteproduct = function(id) {

        var deferred = $q.defer();
        var promise = deferred.promise;
        var data = $.param({
          id: id
        });
        console.log(id);
        $http.delete(apphost + "/products/delete/id/"+id)
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
      return {
        getproductlist: getproductlist,
        getproduct: getproduct,
        getcateloguelist: getcateloguelist,
        getproductmodel: getproductmodel,
        deleteproduct:deleteproduct
      };

    }]);
})();