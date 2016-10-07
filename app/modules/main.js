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