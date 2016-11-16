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
    .run(["$rootScope","$state","_aside", "$log", function($rootScope,$state,_aside,$log){

        $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
            var token = sessionStorage.getItem("token");

            //token有效 && 登录页
            if(toState.name =='login' && token){
                $log.log("有效");
                $state.go("main");
//                return;
            }

            // token无效
            if(!token && toState.name !='login'){
                $log.log("无效");
                event.preventDefault();
                $state.go("login",{from:fromState.name,w:'notLogin'});
                return;
            }

            //略过main
            if(toState.name === "main"){
                return;
            }

            //验证路由的有效性
            _aside.hasRole(toState.name).then(function(auth){
                $log.log("auth:",auth);
                if(!auth){
                    event.preventDefault();
                    $state.go("main");
                }
            });

        });
    }]);