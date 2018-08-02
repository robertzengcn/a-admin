/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.workers', ['angular-md5'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('workers', {
          url: '/workers',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          controller: 'WorkersCtrl',
          title: 'Workers',
          sidebarMeta: {
            icon: 'fa fa fa-anchor',
            order: 1,
          },
        }).state('workers.list', {
          url: '/list',
          templateUrl: 'app/pages/workers/smart/tables.html',
          title: 'List',
          sidebarMeta: {
            order: 100,
          },
        }).state('workers.detail', {
            url: '/detail/:id',
            templateUrl: 'app/pages/workers/widgets/workerDetail.html',
            title: 'Detail',
            controller: 'WorkersdetailCtrl', 
            resolve: {
              workermodels:function($stateParams,WorkerService){
                return WorkerService.getworker($stateParams.id);
              },
              workertypelist:function(WorkerService){
                  return WorkerService.getworkertypelist();
              },
              allgroups:function(WorkerService){
                  return WorkerService.getallgroups();
              },
              allmenus:function(WorkerService){
                  return WorkerService.getallmenus();
              }
            }       
          }).state('workers.create',{
          url: '/create/', 
          templateUrl: 'app/pages/workers/widgets/workerDetail.html',
          title: 'Create Worker',
            sidebarMeta: {
            order: 110,
          },
          controller: 'WorkersdetailCtrl',
          resolve: {
            workermodels:function($stateParams,WorkerService){
             return WorkerService.getworkermodel();
            },
            workertypelist:function(WorkerService){
              return WorkerService.getworkertypelist();
            },
            allgroups:function(WorkerService){
                return WorkerService.getallgroups();
              },
            allmenus:function(WorkerService){
                return WorkerService.getallmenus();
            }
          } 
        }).state('workers.grouplist', {
            url: '/grouplist',
            templateUrl: 'app/pages/workers/smart/grouptables.html',
            controller: 'WorkersGroupCtrl',
            title: 'Groups',
            sidebarMeta: {
              order: 120,
            },
          }).state('workers.groupdetail', {
            url: '/groupdetail/:id',
            templateUrl: 'app/pages/workers/widgets/groupDetail.html',
            title: 'Detail',
            controller: 'WorkersgroupdetailCtrl', 
            resolve: {
                groupmodels:function($stateParams,WorkerService){
                return WorkerService.getworkergroup($stateParams.id);
              },
              allmenus:function(WorkerService){
                  return WorkerService.getallmenus();
              }
            }       
          }).state('workers.creategroup',{
            url: '/creategroup/', 
            templateUrl: 'app/pages/workers/widgets/groupDetail.html',
            title: 'Create Group',
            controller: 'WorkersgroupdetailCtrl',
            resolve: {
                groupmodels:function($stateParams,WorkerService){
                    return WorkerService.getworkermodel();
                  },
                  allmenus:function(WorkerService){
                      return WorkerService.getallmenus();
                  }
            } 
          });
         $urlRouterProvider.when('/workers','/workers/list');
  }

})();
