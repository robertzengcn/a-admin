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
    .factory('ProductService', ["$q","$http","$localStorage",function($q,$http,$localStorage){
      var getproductlist=function(start, number,params){
        var deferred=$q.defer();
        var promise=deferred.promise;
        var progress;
        start=start||0;
        number=number||10;
        var data = $.param({
                start: start,
                length: number
            });
          var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
             $http.post($localStorage.host+"/products/getlist/",data)
        .success(function(data){
            // var result = [];
            // for(var i = 0; i < data.length; i++){
            //     result.push(data[i].user);
            //     progress = (i+1)/data.length * 100;
            //     deferred.notify(progress);
            // }
            deferred.resolve({data:data.data,
              numberOfPages: data.recordsTotal
            });
            })
        .error(function(error){
            deferred.reject(error);
        });
        return promise;
    
      };
      return {
        getproductlist:getproductlist
      };

    }]);
})();