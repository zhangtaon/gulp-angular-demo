"use strict";

/**
 * Created by zto on 2016/10/20.
 */
angular.module("app.test", ['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider) {
            $stateProvider
                .state('main.test', {
                    url: "/test",
                    controller: 'testCtrl',
                    templateUrl: '/src/module/test/test.html'
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
