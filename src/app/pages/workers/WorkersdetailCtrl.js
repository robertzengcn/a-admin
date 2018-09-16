/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
	'use strict';
	angular.module('BlurAdmin.pages.workers')
		.controller('WorkersdetailCtrl', WorkersdetailCtrl);
	/** @ngInject */
	function WorkersdetailCtrl($scope, $filter, $localStorage, editableOptions, editableThemes, WorkerService, workermodels, workertypelist, allgroups, allmenus, allpersm,$http, $timeout, $uibModal, baProgressModal,md5,$window) {
		
		$scope.detail = workermodels.data;
		
		$scope.workertypelist = workertypelist.data;
		$scope.allgroups = allgroups.data;
		$scope.allmenus = allmenus.data;
		$scope.allper=allpersm.data;
		
	    $scope.selected = [];
	    $scope.userpermiss=workermodels.data.permission;//用户权限
	    var updateSelected = function(action, id) {
	      if(action == 'add' & $scope.selected.indexOf(id) == -1) $scope.selected.push(id);
	      if(action == 'remove' && $scope.selected.indexOf(id) != -1) $scope.selected.splice($scope.selected.indexOf(id), 1);
	    console.log(id);
	    };

	    var updatepiSelected = function(action, id) {
	      if(action == 'add' & $scope.userpermiss.indexOf(id) == -1) $scope.userpermiss.push(id);
	      if(action == 'remove' && $scope.userpermiss.indexOf(id) != -1) $scope.userpermiss.splice($scope.userpermiss.indexOf(id), 1);
	    };

	 
	    
		if(!$scope.detail.id){//添加
			if(!$scope.detail.type){
				$scope.detail.type = workertypelist.data[1];//赋予默认值,普通管理员
			}
		} else {
			//加载修改项
			if ($scope.detail.group != '') {
				//console.log($scope.detail.group);
				angular.forEach($scope.detail.menu, function (i) {
		        	updateSelected('add', i.id);
		        });
			}
		}
		
	    $scope.updateSelection = function($event, id) {
		     var checkbox = $event.target;
		     var action = (checkbox.checked ? 'add' : 'remove');
		     updateSelected(action, id);
	    };
	 
	    $scope.isSelected = function(id) {
	        return $scope.selected.indexOf(id) >= 0;
	    };   /*checkbox选中*/
	    /*
	     *判断用户是否有权限
	     */
	    $scope.pisSelected=function(id){
	    	 return $scope.userpermiss.indexOf(id) >= 0;
	    };

	    $scope.updatepiSelection = function($event, id) {
		     var checkbox = $event.target;
		     var action = (checkbox.checked ? 'add' : 'remove');
		     updatepiSelected(action, id);
	    };
		
		/**
		 * 加载菜单
		 */
		$scope.drawMenu = function(groupid) {
			if (groupid == undefined) groupid = $scope.detail.group;
			
			//clear selected
			$scope.selected = [];
			$scope.detail.group = groupid;
			$http({
					method: 'POST',
					url: $scope.app.host + "/Workers/getgroupmenus/group/" + groupid,
					//data: $.param(group_id), // pass in data as strings
					
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					} // set the headers so angular passing info as form data (not request payload)
				})
				.success(function(data) {
					if (data.status) {
				        angular.forEach(data.data, function (i) {
				        	updateSelected('add', i);
				          });
					} else {
						// if successful, bind success message to message
						layer.alert(data.msg);
					}
				});
		};

		/**
		 * 提交表单
		 */
		$scope.processForm = function() {
			if ($scope.detail.password != $scope.confirmpassword) {
				layer.alert('Password is different from confirmpassword!');
				return false;
			}
			
			$scope.selected.sort();
			$scope.detail.new_menus = $scope.selected;
			if($scope.detail.password){
			$scope.detail.password = md5.createHash($scope.detail.password);	
			}
			
			layer.load(1);	
			$http({
					method: 'POST',
					url: $scope.app.host + "/Workers/save/",
					data: $.param($scope.detail), // pass in data as strings
					
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					} // set the headers so angular passing info as form data (not request payload)
				})
				.success(function(data) {
					layer.closeAll('loading');
					console.log(data);

					if (data.status) {
						layer.confirm('Update success!', function(index) {
							//$scope.detail.id=data.data.id;
							//go to groups
							layer.close(index);
							$window.location.href = 'index.html#/workers/list';
				          
				        });
					} else {
						// if successful, bind success message to message
						layer.alert(data.msg);
					}
				});
		};
		
	}

})();