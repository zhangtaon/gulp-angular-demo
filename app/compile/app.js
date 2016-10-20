(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("../src/app");
require("../src/directive/aside/aside");
require("../src/modules/main/main");
require("../src/modules/login/login");
require("../src/modules/test/test");

},{"../src/app":2,"../src/directive/aside/aside":3,"../src/modules/login/login":4,"../src/modules/main/main":5,"../src/modules/test/test":6}],2:[function(require,module,exports){
"use strict";
angular.module("app",[
    "ui.router",
    "app.login",
    "app.main",
]).config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function($stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");
        $locationProvider.html5Mode(false);


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
            controller: function ($scope,$http) {
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
    });
},{}],4:[function(require,module,exports){
"use strict";
angular.module("app.login",['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function($stateProvider, $locationProvider) {
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
        "$http",
        "$rootScope",
        "$state",
        function ($scope, $http,$rootScope,$state) {
            $scope.login = function(){
                $http.get("role/role1.json").success(function(res){
                    sessionStorage.setItem("asideOption",JSON.stringify(res));
                    $state.go("main");
                });
            };
        }
    ]);
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
        "$urlRouterProvider",function ($stateProvider, $locationProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
//            $locationProvider.hashPrefix('!');
            $stateProvider
                .state('main', {
                    url: "/main",
                    controller: 'mainCtrl',
                    templateUrl: 'modules/main/main.html'
                });
            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("mainCtrl", ["$scope","$http",function ($scope,$http) {
        $scope.asideOption = JSON.parse(sessionStorage.getItem("asideOption"));
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
    .controller("testCtrl", ["$scope",function ($scope) {
        console.log('testCtrl');
    }]
);

},{}]},{},[1]);
