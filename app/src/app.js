"use strict";

/**
 * 项目启动入口文件
 * Created by zto on 2016/9/20.
 */
angular.module("app", [
    "ui.router",
    'app.directive',
    'app.serviceModule',
    'app.module'
]).config([
    "$httpProvider",
    "$stateProvider",
    "$locationProvider",
    "$urlRouterProvider",
    function ($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");
        $locationProvider.html5Mode(false);
        $httpProvider.interceptors.push("Interceptor");
    }])
    .run([
        "$rootScope",
        "$state",
        "_aside",
        "_dom",
        function($rootScope,$state,_aside,_dom){

            $rootScope.$on('$stateChangeStart',function(event, toState){
                //_dom服务重置ele列表
                _dom.reset();

                //所有路由都要验证有效性
                _aside.hasAuth(toState.name).then(function(auth){
                    if(!auth){
                        event.preventDefault();
                        $state.go("profile");
                    }
                });
            });
        }
    ]);