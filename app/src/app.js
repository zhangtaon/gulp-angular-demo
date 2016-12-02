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

            $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState){
                
                //_dom服务重置ele列表
                _dom.reset();

                var token = sessionStorage.getItem("token");

                //token有效 如果是请求登录页就返回main页面
                if(toState.name =='login' && token){
                    event.preventDefault();
                    $state.go("main");
                    return;
                }

                // token无效 如果访问内部页就返回到登录页(注：此处要过滤掉所有的外部url及未登录的url)
                if(!token && toState.name !='login' && toState.name !='register'){
                    event.preventDefault();
                    $state.go("login",{from:fromState.name,w:'notLogin'});
                    return;
                }

                //略过main 注：main不在验证路由有效性的范围
                if(toState.name === "main"){
                    return;
                }

                //除以上情况外，所有路由都要验证有效性
                _aside.hasRole(toState.name).then(function(auth){
                    if(!auth){
                        event.preventDefault();
                        $state.go("main");
                    }
                });

            });
        }
    ]);