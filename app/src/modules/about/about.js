"use strict";
angular.module("app.about", ['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider, $urlRouterProvider) {
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
