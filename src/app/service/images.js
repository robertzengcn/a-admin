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
    .factory('ImagesService', ["$q", "$http", "$localStorage", function($q, $http, $localStorage) {
      var apphost = $localStorage.host;
      var getimagelist = function(start, number, params) {

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
        $http.post(apphost + "/images/getlist/", data)
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
      var getimage = function(id) {
        console.log('222');
        var deferred = $q.defer();
        var promise = deferred.promise;
        var data = $.param({
          id: id
        });

        $http.post(apphost + "/images/getdetail/", data)
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
        getimagelist: getimagelist,
        getimage:getimage,
      };

    }]);
})();