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

        /*
        $http({
            url: "/login",
            method: 'post',
            data: {
                key: "test"
            }
        }).then(function (res) {
            console.log("post:", res);
        }, function (res) {
            console.log("post:", res);
        });
        */
    }])
    .run(["$rootScope","$state","_aside",function($rootScope,$state,_aside){

        $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
            console.log("toState.name:",toState.name);
            var token = sessionStorage.getItem("token");

            //登录页且token有效
            if(toState.name =='login' && token){
                $state.go("main");
//                return;
            }

            // 无效
            if(!token){
                event.preventDefault();
                $state.go("login",{from:fromState.name,w:'notLogin'});
                return;
            }

            //略过main
            if(toState.name === "main"){
                return;
            }

            //验证路由的有效性
            _aside.data && _aside.data.then(function(res){
                var hasAuth;
                for(var i= 0,item;item = res.data.datas[i];i++){
                    if(toState.name === item.ref){
                        hasAuth = true;
                        break;
                    }
                    for(var j= 0,_item;_item = item.items[j];j++){
                        if(toState.name === _item.ref){
                            hasAuth = true;
                            break;
                        }
                    }
                    if(hasAuth)break;
                }
                if(!hasAuth){
                    console.log("event",event);
                    event.preventDefault();
                    $state.go("main");
                }
            })

        });
    }]);