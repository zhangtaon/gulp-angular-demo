"use strict";
angular.module("app.main", [
        'ui.router',
        'aside',
        'app.test'
    ])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function ($stateProvider, $locationProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
//            $locationProvider.hashPrefix('!');
            $stateProvider
                .state('main', {
                    url: "/main",
                    controller: 'mainCtrl',
                    templateUrl: 'src/modules/main/main.html',
                    resolve: {
                        menus: ["_aside",function(_aside){
                            return _aside.data;
                        }]
                    }
                });
            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("mainCtrl", ["$scope","$http","menus",function ($scope,$http,menus) {
        $scope.asideOption = menus.data;
    }]);
