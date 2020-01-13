/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('BlurAdmin.pages.images')
		.controller('ImagesdetailCtrl', ImagesdetailCtrl);
	/** @ngInject */
	function ImagesdetailCtrl($scope, $filter, $localStorage, ImagesService, imagemodels, FileUploader, $http, Upload, $timeout,$state) {
		$scope.detail = imagemodels.data;
		var auth = $localStorage.auth;
		var uploader = $scope.uploader = new FileUploader({ //图片上传插件
			url: $localStorage.fileapi,
			alias: 'file',
			headers: {
				'Authorization': auth
			},
			autoUpload: true
		});
		uploader.showtable = false;
		uploader.filters.push({ //图片上传过滤器
			name: 'imageFilter',
			fn: function(item /*{File|FileLikeObject}*/ , options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		uploader.onAfterAddingFile = function(fileItem) {
			//console.info('onAfterAddingFile', fileItem);
			uploader.showtable = true;
		};
		uploader.onCompleteItem = function(fileItem, response, status, headers) {
			console.info('onCompleteItem', fileItem, response, status, headers);
			console.log(status);
			if (response.status) {

				$scope.detail.full_url = response.data.url;
				$scope.detail.image = response.data.path;

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

		/**
		 * 提交表单
		 * @Author    Robert      Zeng
		 * @DateTime  2018-06-14
		 * @copyright [copyright]
		 * @license   [license]
		 * @version   [version]
		 * @return    {[type]}    [description]
		 */
		$scope.processForm = function() {
			layer.load(1);
			$http({
					method: 'POST',
					url: $scope.app.host + "/images/save/",
					data: $.param($scope.detail), // pass in data as strings

					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					} // set the headers so angular passing info as form data (not request payload)
				})
				.success(function(data) {
					layer.closeAll('loading');


					if (data.status) {
						$scope.detail.id = data.data;
						// if not successful, bind errors to error variables
						layer.alert('Update success');
						$state.go('images.list');
					} else {
						// if successful, bind success message to message
						layer.alert(data.msg);
					}
				});
		};


	}

})();