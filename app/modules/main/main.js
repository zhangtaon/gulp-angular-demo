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
