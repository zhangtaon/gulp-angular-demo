(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("../modules/app");
require("../modules/main/main");
require("../modules/login/login");
},{"../modules/app":2,"../modules/login/login":3,"../modules/main/main":4}],2:[function(require,module,exports){
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
        $urlRouterProvider.otherwise("/main");
        $locationProvider.html5Mode(false);

        }
    ]);
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
            console.log("login");

        }
    ]);
},{}],4:[function(require,module,exports){
"use strict";
angular.module("app.main", ['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
            $locationProvider.hashPrefix('!');

            // You can also load via resolve
            $stateProvider
                .state('main', {
                    url: "/main", // root route
                    controller: 'mainCtrl', // This view will use AppCtrl loaded below in the resolve
                    templateUrl: 'modules/main/main.html'
                });
            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("mainCtrl", [function () {

    }]);

},{}]},{},[1]);
