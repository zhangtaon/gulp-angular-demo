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
