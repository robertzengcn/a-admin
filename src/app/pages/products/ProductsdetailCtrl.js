/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('BlurAdmin.pages.products')
		.controller('ProductsdetailCtrl', ProductsdetailCtrl);
	/** @ngInject */
	function ProductsdetailCtrl($scope, $filter, $localStorage, editableOptions, editableThemes, ProductService, productmodels, cateloguelist, FileUploader, $http, Upload, $timeout, $uibModal, baProgressModal, $state) {
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


		$scope.cateloguelist = cateloguelist.data;
		if (!$scope.detail.products_id) { //新建产品
			$scope.detail.products_status = true;

			if (!$scope.detail.master_categories_id) {
				$scope.detail.master_categories_id = $scope.cateloguelist[0].categories_id; //赋予默认值
			}
			$scope.detail.image_list = [];
			$scope.detail.attr = {};
			$scope.detail.attr.optlist = [];
			$scope.detail.attr.attrlist = [];
		}
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
				var sizes = $scope.detail.image_list.length + 1;
				var nimages = {};
				nimages.fullurl = response.data.url;
				nimages.image = response.data.path;
				nimages.num = sizes;
				//nimages.image=response.data;
				console.log(nimages);
				$scope.detail.image_list.push(nimages);
				console.log($scope.detail.image_list);
			} else {

				layer.alert(response.msg);
			}
		};
		uploaders.onCompleteAll = function() {
			uploaders.clearQueue(); //清除上传队列
			uploaders.showtable = false;
			console.info('onCompleteAll');
		};

		$scope.availableOptions = [{
			id: '0',
			name: 'Dropdown'
		}, {
			id: '1',
			name: 'Text'
		}, {
			id: '2',
			name: 'Radio'
		}, {
			id: '3',
			name: 'Checkbox'
		}, {
			id: '4',
			name: 'File'
		}, {
			id: '5',
			name: 'Read Only'
		}, ];

		$scope.newattrtype = $scope.availableOptions[0];


		//console.log($scope.detail.attr.length);
		$scope.getattrlen = function(jsonData) {
			var jsonLength = 0;

			for (var item in jsonData) {

				jsonLength++;

			}

			return jsonLength;
		};
		$scope.showattrlist = true;
		if ($scope.getattrlen($scope.detail.attr) > 0) {
			console.log('show it');
			$scope.showattrlist = true;
		} else {
			$scope.showattrlist = false;
		}
		/**
		 * 删除product option
		 * @Author    Robert      Zeng
		 * @DateTime  2018-05-23
		 * @copyright [copyright]
		 * @license   [license]
		 * @version   [version]
		 * @param     {[type]}
		 * @param     {[type]}
		 * @param     {[type]}
		 * @param     {[type]}
		 * @return    {[type]}
		 */
		$scope.deleattitem = function(pid, attid, sname, key) {
			layer.confirm('Are you sure to delete attibutor?', {
				icon: 3,
				title: 'Delete confirm'
			}, function(index) {
				$http({
					method: "POST",
					url: $scope.app.host + "/Products/delproattritem/",
					data: {
						pid: pid,
						options_values_id: attid
					},
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
					layer.close(index);
					if (response.status) { //success

						$scope.detail.attr.attrlist[sname].splice(key, 1);

					} else {

					}
				});
			});
		};
		//删除属性
		$scope.delattri = function(pid, sname) {
			layer.confirm('Are you sure to delete options?', {
				icon: 3,
				title: 'Delete confirm'
			}, function(index) {
				$http({
					method: "POST",
					url: $scope.app.host + "/Products/delproattr/",
					data: {
						pid: pid,
						options_id: sname
					},
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
					layer.close(index);
					if (response.status) { //success

						delete $scope.detail.attr.attrlist[sname];

					} else {

					}
				});
			});
		};



		/**
		 * 上传图片并设置产品属性图片
		 * @Author    Robert      Zeng
		 * @DateTime  2018-05-23
		 * @copyright [copyright]
		 * @license   [license]
		 * @version   [version]
		 * @param     {object}	file file to uplad
		 * @param     {[type]} errFiles
		 * @param     {[number]} pid product id
		 * @param     {[number]} options_values_id product options values id
		 * @return    {[type]}
		 * 								
		 */
		$scope.uplpoadattrimg = function(file, errFiles, pid, options_values_id, keys, indexs) {
			$scope.f = file;
			$scope.errFile = errFiles && errFiles[0];

			if (file) {
				layer.load(1);
				file.upload = Upload.upload({
					url: $localStorage.fileapi,
					data: {
						file: file
					}
				});

				file.upload.then(function(response) {
					$timeout(function() {
						layer.closeAll('loading');
						file.result = response.data;
						//console.log(file.result);
						if (response.data.status) { //上传图片成功
							layer.msg('Upload image success!');
							layer.load(1);
							$http({
								method: "POST",
								url: $scope.app.host + "/Products/setattrimg/",
								data: {
									pid: pid,
									options_values_id: options_values_id,
									imgsrc: response.data.data.path
								},
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
							}).success(function(responses) {
								layer.closeAll('loading');
								if (responses.status) { //success
									console.log($scope.detail.attr.attrlist[keys][indexs]);
									console.log(indexs);
									$scope.detail.attr.attrlist[keys][indexs].attributes_image = response.data.data.path;
									$scope.detail.attr.attrlist[keys][indexs].fullimage = response.data.data.url;
									layer.msg('update success');
								} else {
									layer.alert(responses.msg);
								}
							});
						} else {
							layer.alert(response.data.msg);
						}
					});
				}, function(response) {
					if (response.status > 0) {

						// $scope.errorMsg = response.status + ': ' + response.data;
					}
				}, function(evt) {
					file.progress = Math.min(100, parseInt(100.0 *
						evt.loaded / evt.total));
				});
			} else {
				layer.alert('File error');
			}

		};

		/**
		 * 打开模态窗口
		 * @Author    Robert      Zeng
		 * @DateTime  2018-05-24
		 * @copyright [copyright]
		 * @license   [license]
		 * @version   [version]
		 * @param     {[type]}
		 * @param     {[type]}
		 * @return    {[type]}
		 */
		$scope.opensetatti = function(page, size, item, pid) {
			console.log($scope.detail.attr.attrlist);
			//$scope.modalatt = item;
			//console.log($scope.detail.attr.attrlist);
			var uibModalInstance = $uibModal.open({
				animation: true,
				templateUrl: page,
				size: size,
				modalatt: {
					item: function() {
						return item;
					}
				},
				controller: 'ModalAttrCtrl',
				resolve: {
					items: function() {
						return item;
					},
					product_id: function() {
						return pid;
					}

				}

			});
			uibModalInstance.result.then(function(selectedItem) {
				//console.log($scope.detail.attr.attrlist);
				//console.log(selectedItem);
				//console.log($scope.detail.attr.attrlist[selectedItem.options_id]);
				//console.log(selectedItem.options_id);

				//console.log('make one');

				//console.log($scope.detail.attr.attrlist[selectedItem.options_id]);
				if ($scope.detail.attr.attrlist[selectedItem.options_id] == undefined) {
					$scope.detail.attr.attrlist[selectedItem.options_id] = [];
				}

				$scope.detail.attr.attrlist[selectedItem.options_id].push(selectedItem);

				//console.log($scope.detail.attr.optlist);

				//$scope.detail.attr.attrlist.cid.push(selectedItem);
				//console.log($scope.detail.attr.attrlist);
			}, function() {
				//$log.info('Modal dismissed at: ' + new Date());
			});

		};

		/**
		 * @param  {[newattr]} string 新的属性
		 * @return {[type]}
		 */
		$scope.addattribtn = function(newattr, newattrtype) {
			if (!newattr) {
				layer.alert('attributes name is empty');
				return;
			}
			var keepGoing = true;
			angular.forEach($scope.detail.attr.optlist, function(value, key) {
				if (keepGoing) {
					if (value == newattr) {
						layer.alert('The Options already exist');
						keepGoing = false;
					}
				}
			});
			if (keepGoing == false) {
				return;
			}
			console.log($scope.detail.attr.optlist);
			console.log(newattrtype);
			layer.load(1);
			$http({
				method: "POST",
				url: $scope.app.host + "/Products/addoption/",
				data: {
					options_values: newattr,
					type: newattrtype.id
				},
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
				layer.closeAll('loading');
				if (response.status) { //success
					if ($scope.detail.attr.optlist == undefined) {
						$scope.detail.attr.optlist = [];
					}
					$scope.detail.attr.optlist[response.data.products_options_id] = newattr;
					if ($scope.detail.attr.attrlist == undefined) {
						$scope.detail.attr.attrlist = [];
					}
					$scope.detail.attr.attrlist[response.data.products_options_id] = [];
					//console.log($scope.detail.attr.attrlist);
					var sitems = {};
					sitems.options_id = response.data.products_options_id;
					sitems.products_options_name = newattr;
					sitems.products_options_type = newattrtype.id;
					console.log($scope.availableOptions);
					sitems.products_options_types_name = newattrtype.name;

					$scope.opensetatti('app/pages/products/widgets/addattModal.html', 'sm', sitems, $scope.detail.products_id);
				} else {

				}
			});

		};
		/**
		 * 属性值的改变方法
		 * @Author    Robert      Zeng
		 * @DateTime  2018-06-11
		 * @copyright [copyright]
		 * @license   [license]
		 * @version   [version]
		 * @return    {[type]}
		 */
		$scope.changestatus = function(item, status) {


			layer.load(1);
			$http({
				method: "POST",
				url: $scope.app.host + "/Products/chattrstatus/",
				data: {
					attr: item,
					status: status
				},
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
				layer.closeAll('loading');
				if (response.status) { //success


				} else {

				}
			});
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
					url: $scope.app.host + "/Products/save/",
					data: $.param($scope.detail), // pass in data as strings

					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					} // set the headers so angular passing info as form data (not request payload)
				})
				.success(function(data) {
					layer.closeAll('loading');
					console.log(data);

					if (data.status) {
						$scope.detail.products_id = data.data.products_id;
						$scope.detail.products_description = data.data.products_description;
						// UE.getEditor('product_description').setContent(data.data.products_description);
						// if not successful, bind errors to error variables

						layer.alert('update success', {
							btn: ['ok', 'go list', 'go list'] //可以无限个按钮
								,
							btn3: function(index, layero) {
								console.log(3);
								$state.go('products.list');
							},


						}, function(index, layero) {
							console.log(1);
							layer.close(index);
						}, function(index) {
							console.log('2');
							$state.go('products.list');
						});
					} else {
						// if successful, bind success message to message
						layer.alert('Update fail', {
							icon: 2
						});
					}
				});
		};

	}
	angular.module('BlurAdmin.pages.products')
		.controller('ModalAttrCtrl', ModalAttrCtrl);

	function ModalAttrCtrl($uibModalInstance, items, product_id, $scope, $http, Upload, $localStorage, $timeout) {


		var $ctrl = this;
		$scope.atta_options_id = items.options_id;
		$scope.atta_status = true;

		$scope.atta_product_id = product_id;
		$scope.atta_imgsrc = null;

		$scope.saveatta = function() {
			//console.log($scope.atta_options_values);

			if (!$scope.atta_options_values) {
				layer.alert('options values is empty');
				return;
			}
			if (!$scope.atta_product_img) {
				$scope.atta_product_img = null;
			}
			var sattrstu = 1;
			if (!$scope.atta_status) {
				$scope.atta_status = 0;
			}
			var index = layer.load();
			$http({
				method: "POST",
				url: $scope.app.host + "/Products/addoptionvalues/",
				data: {
					pid: $scope.atta_product_id,
					options_id: $scope.atta_options_id,
					options_values: $scope.atta_options_values,
					attributes_image: $scope.atta_product_img,
					attributes_status: sattrstu
				},
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
				layer.closeAll('loading');
				if (response.status) { //success
					var reitem = {};
					//reitem.pid=$scope.atta_product_id;
					reitem.options_id = $scope.atta_options_id;
					reitem.options_values = $scope.atta_options_values;
					reitem.attributes_image = $scope.atta_product_img;

					reitem.fullimage = $scope.atta_imgsrc;
					reitem.options_values_id = response.data.options_values_id;
					reitem.products_attributes_id = response.data.products_attributes_id;
					reitem.products_options_name = items.products_options_name;
					reitem.products_options_type = items.products_options_type;
					reitem.products_options_types_name = items.products_options_types_name;
					reitem.products_options_values_name = $scope.atta_options_values;
					reitem.attributes_status = $scope.atta_status;
					$uibModalInstance.close(reitem);
					//$scope.detail.attr.attrlist.push();
				} else {
					layer.alert(response.msg);
				}
			});
		};
		/**
		 * 添加图片,上传图片到服务端，返回图片路径
		 * @Author    Robert      Zeng
		 * @DateTime  2018-05-28
		 * @copyright [copyright]
		 * @license   [license]
		 * @version   [version]
		 * @return    {[type]}
		 */
		$scope.uploadopimg = function(file, errFiles) {
			if (file) {
				layer.load(1);
				file.upload = Upload.upload({
					url: $localStorage.fileapi,
					data: {
						file: file
					}
				});

				file.upload.then(function(response) {
					$timeout(function() {
						layer.closeAll('loading');
						file.result = response.data;
						//console.log(file.result);
						if (response.data.status) { //上传图片成功
							layer.msg('Upload image success!');
							$scope.atta_product_img = response.data.data.path;
							$scope.atta_imgsrc = response.data.data.url;
						} else {
							layer.alert(response.data.msg);
						}
					});
				}, function(response) {
					if (response.status > 0) {

						// $scope.errorMsg = response.status + ': ' + response.data;
					}
				}, function(evt) {
					file.progress = Math.min(100, parseInt(100.0 *
						evt.loaded / evt.total));
				});
			} else {
				layer.alert('File error');
			}
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
	}

})();