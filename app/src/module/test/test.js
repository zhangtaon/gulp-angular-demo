"use strict";

/**
 * Created by zto on 2016/10/20.
 */
angular.module("app.module")
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider) {
            $stateProvider
                .state('test', {
                    url: "/test",
                    controller: 'testCtrl',
                    templateUrl: '/src/module/test/test.html'
                });

            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("testCtrl", ["$scope","$http","_alert",function ($scope,$http,_alert) {
        $http({
            url: "/demo2",
            method: 'put',
            data: {zto:10,cc:20}
        }).then(function (res) {
            _alert.show(res.data.error.returnMessage);
        }, function (res) {
            console.log("post:", res);
        });
    }]
);
