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
                .state('main.about', {
                    url: "/about",
                    controller: 'aboutCtrl',
                    templateUrl: '/src/module/about/about.html'
                });

            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("aboutCtrl", ["$scope","$http","_alert",function ($scope,$http,_alert) {

        $http({
            url: "/demo1/"+"rentinting"+"/name",
            method: 'get',
            params: {zto:10,cc:20,sn:30}
        }).then(function (res) {
            _alert.show("aboutCtrl get demo1 success");
            console.log("post:", res.data.data);
        }, function (res) {
            console.log("post:", res);
        });
    }]

);
