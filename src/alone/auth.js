app.controller('LoginController',function($scope,$state,$http,$localStorage,md5,$window){
   

    $scope.login = function(){
   console.log($scope.app.host);
        $scope.authError = "";
       //var authdata = Base64.encode($scope.user.username + ':' + $scope.user.password);
       var passwords=md5.createHash($scope.user.password);
       // $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
   //      var $com = $resource($scope.app.host + "/auth/info/");
   //      $com.get(function(data){
			// $scope.session_user = $localStorage.user = data;
			// $localStorage.auth = authdata;
   //          $state.go('app.dashboard');
   //      },function(){
   //          $scope.authError = "服务器登录错误";
   //      });
   $http({      
            method: "POST",      
            url: $scope.app.host + "/auth/getauth/",      
            data: {username: $scope.user.username,password:passwords},    
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    
               transformRequest: function(obj) {    
          var str = [];    
          for (var s in obj) {    
            str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));    
          }    
          return str.join("&");    
        }    
 }).success(function (response){
  console.log(response);
  if(response.status){
    $scope.session_user =$scope.user.username;
    $localStorage.auth = response.data.token;
    $localStorage.fileapi = response.data.fileapi;
    $localStorage.ueapi=response.data.ueapi;
    $localStorage.menus=JSON.stringify(response.data.menu);
    //$state.go('app.dashboard');
      $window.location.href = "/index.html"; 
  }else{
    $scope.authError=response.data.msg;
  }
 }); 
    };
});