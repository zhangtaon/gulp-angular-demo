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