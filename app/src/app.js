"use strict";
angular.module("app", [
    "ui.router",
    "app.login",
    "app.main",
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
        function($rootScope,$state,_aside){

            $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState){
                var token = sessionStorage.getItem("token");

                //token有效 如果是请求登录页就返回main页面
                if(toState.name =='login' && token){
                    event.preventDefault();
                    $state.go("main");
                    return;
                }

                // token无效 如果访问内部页就返回到登录页
                if(!token && toState.name !='login'){
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