/**
 * @author v.lugovsky
 * created on 23.12.2015
 */
(function () {
  'use strict';

  /**
   * Represents current element as panel, adding all necessary classes.
   */
  angular.module('BlurAdmin.service')
      .service('ProductService', ProductService);

      function ProductService($http){
        var service={
          getproductlist:function(){
            console.log('1122');
            console.log('abcd');
          }
        };
        return service;
      }



})();
