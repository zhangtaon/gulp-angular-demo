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
            console.log("dd2");
            $scope.pageName = "login.html111222333";
            $scope.img = "image/banner.jpg";
            $scope.post = function(){
                $http({
                    url: "/demo1",
                    method: 'post',
                    data: {
                        key: "test"
                    }
                }).then(function(res){
                    console.log("post:",res);
                }, function (res) {
//                    console.log("post:",res);
                });
            };
            $scope.get = function(){
                $http({
                    url: "/demo2",
                    method: 'get',
                    params: {zto:10,cc:20,sn:30}
                }).then(function(res){
                    console.log("get:",res);
                }, function (res) {
                    console.log("get:",res);
                });
            };
        }
    ]);