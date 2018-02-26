/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('BaSidebarCtrl', BaSidebarCtrl);

  /** @ngInject */
  function BaSidebarCtrl($scope, baSidebarService,$localStorage, baConfig) {

    $scope.menuItems = baSidebarService.getMenuItems();
    
    //添加动态菜单
    $scope.menuItemsAccess = [];
    var jsonMenu=[];
    if($localStorage.menus){
      jsonMenu = JSON.parse($localStorage.menus); // JSON from Service
    }
   
    angular.forEach($scope.menuItems, function (baSideBarMenu) {
        angular.forEach(jsonMenu, function (accessMenu) {          
            if (accessMenu === baSideBarMenu.name) {
                $scope.menuItemsAccess.push(baSideBarMenu);
                return;
            }
        });
    });

    $scope.menuItems = $scope.menuItemsAccess;
  
    if($scope.menuItems[0]!=undefined){
     $scope.defaultSidebarState = $scope.menuItems[0].stateRef;
    }else{
      $scope.defaultSidebarState ='dashboard';
    }
   
   

    $scope.hoverItem = function ($event) {
      $scope.showHoverElem = true;
      $scope.hoverElemHeight =  $event.currentTarget.clientHeight;
      var menuTopValue = 66;
      $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
    };

    $scope.$on('$stateChangeSuccess', function () {
      if (baSidebarService.canSidebarBeHidden()) {
        baSidebarService.setMenuCollapsed(true);
      }
    });
  }
})();