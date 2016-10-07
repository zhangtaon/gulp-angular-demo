(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("../modules/main");
require("../modules/login/login");
require("../modules/index/index");


},{"../modules/index/index":2,"../modules/login/login":3,"../modules/main":4}],2:[function(require,module,exports){
"use strict";
angular.module("app.index", ['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
            $locationProvider.hashPrefix('!');

            // You can also load via resolve
            $stateProvider
                .state('index', {
                    url: "/index", // root route
                    controller: 'indexCtrl', // This view will use AppCtrl loaded below in the resolve
                    templateUrl: 'modules/index/index.html'
                });
            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("indexCtrl", [function () {

    }]);

},{}],3:[function(require,module,exports){
"use strict";
angular.module("app.login",['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function($stateProvider, $locationProvider) {
            // You can also load via resolve
            $stateProvider
                .state('login', {
                    url: "/login", // root route
                    controller: 'loginCtrl', // This view will use AppCtrl loaded below in the resolve
                    templateUrl: 'modules/login/login.html'
                });
            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("loginCtrl", [
        "$scope",
        "$http",
        function ($scope, $http) {
            console.log("dd2");
            $scope.pageName = "login.html111222333";
            $scope.img = "image/banner.jpg";
            $scope.post = function(){
                $http({
                    url: "/demo1",
                    method: 'post',
                    data: {
                        key: "test"
                    }
                }).then(function(res){
                    console.log("post:",res);
                }, function (res) {
//                    console.log("post:",res);
                });
            };
            $scope.get = function(){
                $http({
                    url: "/demo2",
                    method: 'get',
                    params: {zto:10,cc:20,sn:30}
                }).then(function(res){
                    console.log("get:",res);
                }, function (res) {
                    console.log("get:",res);
                });
            };
        }
    ]);
},{}],4:[function(require,module,exports){
"use strict";
angular.module("app",[
    "ui.router",
    "app.login",
    "app.index",
])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function($stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/index");
        $locationProvider.html5Mode(false);

        }
    ]);
},{}]},{},[1]);
