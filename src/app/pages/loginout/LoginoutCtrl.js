/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('BlurAdmin.pages.products')
		.controller('LoginoutCtrl', LoginoutCtrl);
	/** @ngInject */
	function LoginoutCtrl($scope,$localStorage,$location, $window) {
		console.log('loginout');
		 $window.localStorage.clear();
		 $window.location.href = "/auth.html";
	}

})();