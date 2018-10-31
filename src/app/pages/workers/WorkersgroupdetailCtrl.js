/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
	'use strict';
	angular.module('BlurAdmin.pages.workers')
		.controller('WorkersgroupdetailCtrl', WorkersgroupdetailCtrl);
	/** @ngInject */
	function WorkersgroupdetailCtrl($scope, $filter, $localStorage, editableOptions, editableThemes, WorkerService, groupmodels, allmenus, $http, $timeout, $uibModal, baProgressModal, $window) {
		//console.log(groupmodels.data);
		$scope.detail = groupmodels.data;
		$scope.allmenus = allmenus.data;
		
	    $scope.selected = [];
	    var updateSelected = function(action, id) {
	      if(action == 'add' & $scope.selected.indexOf(id) == -1) $scope.selected.push(id);
	      if(action == 'remove' && $scope.selected.indexOf(id) != -1) $scope.selected.splice($scope.selected.indexOf(id), 1);
	    };
	 
	    
		if($scope.detail.id){
			if ($scope.detail.menu != '') {
				angular.forEach($scope.detail.menu, function (i) {
		        	updateSelected('add', i);
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
		
		/**
		 * 提交表单
		 */
		$scope.processForm = function() {
			$scope.selected.sort();
			$scope.detail.menu = $scope.selected;
			
			layer.load(1);	
			$http({
					method: 'POST',
					url: $scope.app.host + "/Workers/addmenutogroup/",
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
				            $scope.detail.id=data.data.id;
							//go to groups
							//$window.location.href = 'index.html#/workers/grouplist';
				        
				          layer.close(index);
				          history.back();
							$scope.$apply();
				        });
					      
					} else {
						// if successful, bind success message to message
						layer.alert(data.msg);
					}
				});
		};
		
	}

})();