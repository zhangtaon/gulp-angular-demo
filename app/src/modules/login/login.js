"use strict";
angular.module("app.login",['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function($stateProvider, $locationProvider) {
            $stateProvider
                .state('login', {
                    url: "/login",
                    controller: 'loginCtrl',
                    templateUrl: 'src/modules/login/login.html'
                });

            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("loginCtrl", [
        "$scope",
        "$http",
        "$rootScope",
        "$state",
        function ($scope, $http,$rootScope,$state) {
            $scope.login = function(){
                $http.get("role/role1.json").success(function(res){
                    sessionStorage.setItem("asideOption",JSON.stringify(res));
                    $state.go("main");
                });
            };
        }
    ]);