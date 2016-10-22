"use strict";
angular.module("app.main", [
        'ui.router',
        'aside',
        'app.test'
    ])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
//            $locationProvider.hashPrefix('!');
            $stateProvider
                .state('main', {
                    url: "/main",
                    controller: 'mainCtrl',
                    templateUrl: 'modules/main/main.html'
                });
            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("mainCtrl", ["$scope","$http",function ($scope,$http) {
        console.log("main token:",sessionStorage.getItem("token"));
        $scope.asideOption = JSON.parse(sessionStorage.getItem("asideOption"));
    }]);
