(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("../src/app");
require("../src/service/interceptor");
require("../src/directive/aside/aside");
require("../src/modules/main/main");
require("../src/modules/login/login");
require("../src/modules/test/test");

},{"../src/app":2,"../src/directive/aside/aside":3,"../src/modules/login/login":4,"../src/modules/main/main":5,"../src/modules/test/test":6,"../src/service/interceptor":7}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
/**
 * 侧边栏指令
 * option为指定的配置参数,他的值为绑定在所在模块控制器作用域上的属性
 * option：{
        datas：
        [
            {
                href:"Home",
                title:"Home",
                items: [
                    {href:"test1",title:"test1"},
                    {href:"test2",title:"test2"}
                ]
              },
            {
                href:"Projects",
                title:"Projects",
                items: [

                ]
            }
        ]
    }
 * Created by zto on 2016/10/20.
 */

"use strict";
angular.module("aside", [])
    .directive("aside", function () {
        return{
            restrict: "A",
            scope: {
                option: "="
            },
            replace: true,
            templateUrl: '/src/directive/aside/aside.html',
            controller: function ($scope) {
                $scope.menus = $scope.option.datas;
                $scope.getFirstClass = function (title) {
                    return {active: title == $scope.firstActive};
                };
                $scope.getSecondClass = function (title) {
                    return {active: title == $scope.secondActive};
                };
                $scope.select = function (tab, $event) {
                    var target = angular.element($event.target);
                    if (Number(target.attr("data-level")) == 2) {
                        $scope.secondActive = target.attr("data-title");
                    } else {
                        if ($scope.firstActive != tab.title) {
                            $scope.secondActive = "";
                        }
                    }
                    $scope.firstActive = tab.title;
                };
            }
        }
    })
    .factory("_aside", ["$http", "$log", function ($http, $log) {
        try {
            var userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
            $log.log("userinfo:",userinfo);
        } catch (e) {
            $log.error("$log:", e);
        }
//        var data = userinfo ? $http.get("role/" + userinfo.role + ".json") : null;
        var aside = {
            init: function(role){
                this.data = $http.get("role/" + role + ".json");
            },
            /**
             * 侧边栏数据
             */
            data: null
        };
        if(userinfo){
            aside.init(userinfo.role);
        }
        return aside;
    }])
;
},{}],4:[function(require,module,exports){
"use strict";
angular.module("app.login", ['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function ($stateProvider, $locationProvider) {
            $stateProvider
                .state('login', {
                    url: "/login",
                    controller: 'loginCtrl',
                    templateUrl: 'src/modules/login/login.html'
                });

            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("loginCtrl", [
        "$scope",
        "$rootScope",
        "_loginService",
        function ($scope, $rootScope, _loginService) {
            $scope.login = function () {
                _loginService.login();
            };
        }
    ])
    .factory("_loginService",[
        "$http",
        "_aside",
        "$state",
        "$rootScope",
        function($http,_aside,$state,$rootScope){
            return {
                login: function(){
                    $http.post("/login").success(function (res) {
                        sessionStorage.setItem("userinfo", JSON.stringify(res.data));
                        $rootScope.userinfo = res.data;
                        _aside.init(res.data.role);
                        $state.go("main");
                    });
                }
            }
        }])
;
},{}],5:[function(require,module,exports){
"use strict";
angular.module("app.main", [
        'ui.router',
        'aside',
        'app.test'
    ])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function ($stateProvider, $locationProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
//            $locationProvider.hashPrefix('!');
            $stateProvider
                .state('main', {
                    url: "/main",
                    controller: 'mainCtrl',
                    templateUrl: 'src/modules/main/main.html',
                    resolve: {
                        menus: ["_aside",function(_aside){
                            return _aside.data;
                        }]
                    }
                });
            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("mainCtrl", ["$scope","$http","menus",function ($scope,$http,menus) {
        $scope.asideOption = menus.data;
    }]);

},{}],6:[function(require,module,exports){
"use strict";
angular.module("app.test", ['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider, $urlRouterProvider) {
            $stateProvider
                .state('main.test', {
                    url: "/test",
                    controller: 'testCtrl',
                    templateUrl: 'src/modules/test/test.html'
                });

            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("testCtrl", ["$scope","$http",function ($scope,$http) {
        $http({
            url: "/demo2",
            method: 'get',
            params: {zto:10,cc:20,sn:30}
        }).then(function (res) {
            //                    console.log("post:", res);
        }, function (res) {
            console.log("post:", res);
        });
    }]
);

},{}],7:[function(require,module,exports){
"use strict";
/**
 * http拦截器
 * 注：封装登录token
 */
angular.module("app")
    .factory('Interceptor', ["$q","$rootScope","$log","$location",function ($q,$rootScope,$log,$location) {
        return {
            request: function (config) {
                config.headers.token = sessionStorage.getItem("token");
                return config;
            },
            response: function (resp) {
                if (resp.config.url == '/login') {
                    sessionStorage.setItem("token", resp.config.headers.token || resp.data.token);
                }
                return resp;
            },
            responseError: function (rejection) {
                //错误处理
                switch (rejection.status) {
                    case 401:
                        if (rejection.config.url !== '/login') {
                            sessionStorage.setItem("token", null);
                            sessionStorage.setItem("userinfo", null);
                            $log.log("auth:loginRequired");
                        }
                        $location.url("/login");
                        break;
                    case 403:
                        $log.warn("auth:forbidden");
                        break;
                    case 404:
                        $log.warn("url:notFound");
                        break;
                    case 405:
                        $log.warn("method:notAllowed");
                        break;
                    case 500:
                        $log.error("server:error");
                        break;
                }
                return $q.reject(rejection);
            }
        };
    }
]);
},{}]},{},[1]);
