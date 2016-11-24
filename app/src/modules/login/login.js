"use strict";
angular.module("app.login", ['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function ($stateProvider, $locationProvider) {
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
        "$rootScope",
        "_loginService",
        function ($scope, $rootScope, _loginService) {
            $scope.login = function () {
                _loginService.login();
            };

        }
    ])
    .factory("_loginService",[
        "$http",
        "_aside",
        "$state",
        "$rootScope",
        function($http,_aside,$state,$rootScope){
            return {
                login: function(){
                    $http.post("/login").success(function (res) {
                        sessionStorage.setItem("userinfo", JSON.stringify(res.data));
                        $rootScope.userinfo = res.data;
                        _aside.init(res.data.role);
                        $state.go("main");
                    });
                }
            };
        }])
;