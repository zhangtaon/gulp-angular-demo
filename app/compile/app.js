(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("../src/app");
require("../src/service/interceptor");
require("../src/directive/aside/aside");
require("../src/modules/main/main");
require("../src/modules/login/login");
require("../src/modules/test/test");
require("../src/modules/about/about");

},{"../src/app":2,"../src/directive/aside/aside":3,"../src/modules/about/about":4,"../src/modules/login/login":5,"../src/modules/main/main":6,"../src/modules/test/test":7,"../src/service/interceptor":8}],2:[function(require,module,exports){
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

 * _aside服务应用于多个依赖（app、main）
 *
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
            templateUrl: 'src/directive/aside/aside.html',
            controller: ["$scope",function ($scope) {
//                $scope.menus = $scope.option.datas;
//                $scope.spread = $scope.option.spread;
            }]
        };
    })
    /**
     * 如果用户已经登录，根据用户角色获取侧边栏数据
     */
    .factory("_aside", [
        "$http",
        "$log",
        "$q",
        function ($http, $log, $q) {
            var userinfo;
            try {
                userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
            } catch (e) {
                $log.error("$log:", e);
            }

            /**
             * 侧边栏数据对象
             */
            var aside = {
                init: function(role){
                    this.data = $http.get("role/" + role + ".json");
                },
                data: null,
                hasRole: function(stateName){
                    var defer = $q.defer(),hasAuth;
                    if(this.data){
                        this.data.then(function(res){
                            for(var i= 0,item;(item = res.data.datas[i]);i++){
                                if(stateName === item.ref){
                                    hasAuth = true;
                                    break;
                                }
                                for(var j= 0,_item;(_item = item.items[j]);j++){
                                    if(stateName === _item.ref){
                                        hasAuth = true;
                                        break;
                                    }
                                }
                                if(hasAuth){
                                    break;
                                }
                            }
                            defer.resolve(hasAuth);
                        });
                    }
                    return defer.promise;
                }
            };
            if(userinfo){
                aside.init(userinfo.role);
            }
            return aside;
        }
    ])
;
},{}],4:[function(require,module,exports){
"use strict";
angular.module("app.about", ['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider) {
            $stateProvider
                .state('main.about', {
                    url: "/about",
                    controller: 'aboutCtrl',
                    templateUrl: 'src/modules/about/about.html'
                });

            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("aboutCtrl", ["$scope","$http",function ($scope,$http) {
        $http({
            url: "/demo1",
            method: 'get',
            params: {zto:10,cc:20,sn:30}
        }).then(function (res) {
            console.log("post:", res.data.data);
        }, function (res) {
            console.log("post:", res);
        });
    }]
);

},{}],5:[function(require,module,exports){
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
            };
        }])
;
},{}],6:[function(require,module,exports){
"use strict";
angular.module("app.main", [
        'ui.router',
        'aside',
        'ui.bootstrap',
        'app.test',
        'app.about'
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
    .controller("mainCtrl", [
        "$scope",
        "$http",
        "menus",
        "_main",
        function ($scope,$http,menus,_main) {

            //初始化侧边栏
            $scope.asideOption = {
                datas: menus.data.datas,
                spread: function(){
                    _main.domNode.toggleClass("spread");
                }
            };

        }
    ])
    .factory("_main",function(){
        return {
            domNode:null
        };
    })
    .directive("main",["_main",function(_main){
        return {
            scope:{},
            restrict: "A",
            link: function ($scope,ele,attrs) {
                _main.domNode = ele;
            }
        };
    }])
;

},{}],7:[function(require,module,exports){
"use strict";
angular.module("app.test", ['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider) {
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
            console.log("get:", res.data.data);
        }, function (res) {
            console.log("post:", res);
        });
    }]
);

},{}],8:[function(require,module,exports){
"use strict";
/**
 * http拦截器
 * 注：封装登录token
 */
angular.module("app")
    .factory('Interceptor', [
        "$q",
        "$rootScope",
        "$log",
        "$location",
        function ($q,$rootScope,$log,$location) {
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
