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
            console.log("login",$scope);
            console.log("login",$http);
        }
    ]);