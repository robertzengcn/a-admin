'use strict';

var app = angular.module('BlurAdmin', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'ngStorage',
  'ngTouch',
  'toastr',
  'smart-table',
  "xeditable",
  'ui.slimscroll',
  'ngJsTree',
  'angular-md5',
]);
app.run(function($rootScope, $http, $state, $stateParams, $localStorage, $window, $location) {
  
  $http({
    method: "GET",
    url: "/env.json",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }).success(function(response) {
    
    $rootScope.app = response;
    $localStorage.host=response.host;
    var authtoken = $localStorage.auth;


    if (authtoken) { //token存在则验证token
      $http.defaults.headers.common['Authorization'] = $localStorage.auth;
      $http({
        method: "POST",
        url: $rootScope.app.host + "/auth/info/",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(obj) {
          var str = [];
          for (var s in obj) {
            str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
          }
          return str.join("&");
        }
      }).success(function(response) {

        if (response.status) {
          $window.location.href = "/index.html";

        } else {
          var absurl = $location.absUrl();
          if (absurl.indexOf("/auth.html") <= 0) {
            $window.location.href = "/auth.html";
          }
        }
      });

    } else { //token不存在，跳转登录页面
      var absurl = $location.absUrl();
          if (absurl.indexOf("/auth.html") <= 0) {
            $window.location.href = "/auth.html";
          }
    }
  });
  // $http.defaults.headers.common.Authorization = $localStorage.auth;
});