/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('BlurAdmin.pages.products')
		.controller('ProductsdetailCtrl', ProductsdetailCtrl);

	/** @ngInject */
	function ProductsdetailCtrl($scope, $filter, $localStorage, editableOptions, editableThemes, ProductService, productmodels, cateloguelist, FileUploader,$http) {
		var auth = $localStorage.auth;
		var uploader = $scope.uploader = new FileUploader({
			url: $localStorage.fileapi,
			alias: 'file',
			headers: {
				'Authorization': auth
			},
			autoUpload: true
		});
		//$httpProvider.defaults.headers.common = { 'My-Header' : 'value' };

		$scope.detail = productmodels.data;
		console.log($scope.detail.full_products_image);
		$scope.cateloguelist = cateloguelist.data;

		//配置ueditor
		$scope.config = {
			serverUrl: $localStorage.ueapi,
			auth: auth,
		};

		$scope.ready = function(editor) { //编辑器加载完毕
			editor.execCommand('serverparam', function(editor) {
				return {
					'auth': auth
				};
			});
		};

		uploader.filters.push({
			name: 'imageFilter',
			fn: function(item /*{File|FileLikeObject}*/ , options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		uploader.showtable = false;

		uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
			//console.info('onWhenAddingFileFailed', item, filter, options);
		};
		uploader.onAfterAddingFile = function(fileItem) {
			//console.info('onAfterAddingFile', fileItem);
			uploader.showtable = true;
		};
		uploader.onAfterAddingAll = function(addedFileItems) {
			//console.info('onAfterAddingAll', addedFileItems);
		};
		uploader.onBeforeUploadItem = function(item) {

			//console.info('onBeforeUploadItem', item);
		};
		uploader.onProgressItem = function(fileItem, progress) {
			//console.info('onProgressItem', fileItem, progress);
		};
		uploader.onProgressAll = function(progress) {
			//console.info('onProgressAll', progress);
		};
		uploader.onSuccessItem = function(fileItem, response, status, headers) {
			//console.info('onSuccessItem', fileItem, response, status, headers);

		};
		uploader.onErrorItem = function(fileItem, response, status, headers) {
			console.info('onErrorItem', fileItem, response, status, headers);
		};
		uploader.onCancelItem = function(fileItem, response, status, headers) {
			console.info('onCancelItem', fileItem, response, status, headers);
		};
		uploader.onCompleteItem = function(fileItem, response, status, headers) {
			console.info('onCompleteItem', fileItem, response, status, headers);
			console.log(status);
			if (response.status) {
				console.log(response);
				console.log(status);
				$scope.detail.full_products_image = response.data.url;
				$scope.detail.products_image = response.data.path;
				
			} else {
				console.log('error');
				layer.alert(response.msg);
			}
		};
		uploader.onCompleteAll = function() {
			uploader.clearQueue(); //清除上传队列
				uploader.showtable = false;
			console.info('onCompleteAll');
		};

		//console.info('uploader', uploader);
		$scope.showimagelist = false;
		//处理image list
		if ($scope.detail.image_list) { //如果图片存在
			$scope.showimagelist = true;

		}
		$scope.deleteimage = function(idx) {
			$scope.detail.image_list.splice(idx, 1);
		};
		
		var uploaders = $scope.uploaders = new FileUploader({
			url: $localStorage.fileapi,
			alias: 'file',
			headers: {
				'Authorization': auth
			},
			autoUpload: true
		});
		uploaders.showtable = false; //上传产品多图
		uploaders.filters.push({
			name: 'imageFilter',
			fn: function(item /*{File|FileLikeObject}*/ , options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});
		uploaders.onAfterAddingFile = function(fileItem) {
			//console.info('onAfterAddingFile', fileItem);
			uploaders.showtable = true;
		};
		uploaders.onCompleteItem = function(fileItem, response, status, headers) {
			console.info('onCompleteItem', fileItem, response, status, headers);
			console.log(status);
			if (response.status) {
				var sizes=$scope.detail.image_list.length+1;
				var nimages=[];
				nimages.fullurl=response.data.url;
				nimages.image=response.data.path;
				nimages.num=sizes;
				//nimages.image=response.data;
				$scope.detail.image_list.push(nimages);
			} else {
				
				layer.alert(response.msg);
			}
		};
	uploaders.onCompleteAll = function() {
		uploaders.clearQueue(); //清除上传队列
				uploaders.showtable = false;
			console.info('onCompleteAll');
		};



//添加产品属性
$scope.addattri=function(){

};
//console.log($scope.detail.attr.length);
$scope.getattrlen=function(jsonData){
	   var jsonLength = 0;  
  
    for(var item in jsonData){  
  
        jsonLength++;  
  
    }  
  
    return jsonLength;  
};
$scope.showattrlist=true;
	if($scope.getattrlen($scope.detail.attr)>0){
		console.log('show it');
		$scope.showattrlist=true;
	}else{
	$scope.showattrlist=false;
	}
$scope.deleattitem=function(pid,attid,sname,key){
	layer.confirm('Are you sure to delete attibutor?', {icon: 3, title:'Delete confirm'}, function(index){
  $http({      
            method: "POST",      
            url: $scope.app.host + "/Products/delproattritem/",      
            data: {pid:pid,options_values_id: attid},    
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    
               transformRequest: function(obj) {    
          var str = [];    
          for (var s in obj) {    
            str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));    
          }    
          return str.join("&");    
        }    
 }).success(function (response){
 	  layer.close(index);
  if(response.status){//success

$scope.detail.attr.attrlist[sname].splice(key,1);

  }else{
   
  }
 });
 });
};	
$scope.delattri=function(pid,sname){
	layer.confirm('Are you sure to delete options?', {icon: 3, title:'Delete confirm'}, function(index){
   $http({      
            method: "POST",      
            url: $scope.app.host + "/Products/delproattr/",      
            data: {pid:pid,options_id: sname},    
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    
               transformRequest: function(obj) {    
          var str = [];    
          for (var s in obj) {    
            str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));    
          }    
          return str.join("&");    
        }    
 }).success(function (response){
 	  layer.close(index);
  if(response.status){//success

delete $scope.detail.attr.attrlist[sname];
 
  }else{
   
  }
 });
 });
};

	}

})();