"use strict";

/**
 * 注册模块
 * Created by zto on 2016/12/2.
 */
angular.module("app.register", [])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function ($stateProvider) {
            $stateProvider
                .state('register', {
                    url: "/register",
                    controller: 'registerCtrl',
                    templateUrl: '/src/serviceModule/register/register.html'
                });
        }
    ])
    .controller("registerCtrl", [
        "$scope",
        "$rootScope",
        "_registerService",
        function ($scope, $rootScope, _registerService) {
            $scope.register = function (valid) {
                $scope.submitted = true;
                valid && _registerService.register($scope.registerModel);// jshint ignore:line
            };
        }
    ])
    .factory("_registerService",[
        "$http",
        function($http){
            return {
                register: function(data){
                    $http.post("/register",data).then(function (res) {
                        if(res.data.error.returnCode == 200){
                            console.log("ok res:",res.data.error.returnMessage);
                        }
                    });
                }
            };
        }])
;