"use strict";

/**
 * 登录模块
 * Created by zto on 2016/10/20.
 */
angular.module("app.login", ['ui.router'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function ($stateProvider) {
            $stateProvider
                .state('login', {
                    url: "/login",
                    controller: 'loginCtrl',
                    templateUrl: '/src/serviceModule/login/login.html'
                });
        }
    ])
    .controller("loginCtrl", [
        "$scope",
        "$rootScope",
        "_loginService",
        "$state",
        function ($scope, $rootScope, _loginService, $state) {

            $scope.$watch("loginModel.account",function(){
                $scope.logined = true;
            });
            $scope.$watch("loginModel.password",function(){
                $scope.logined = true;
            });

            $scope.login = function (valid) {
                $scope.submitted = true;
                valid && _loginService.login($scope.loginModel,function(){
                    $scope.logined = false;//登录错误信息显示控制
                }); // jshint ignore:line
            };
            $scope.register = function () {
                $state.go("register");
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
                login: function(model,call){
                    $http.post("/login",model).then(function (res) {
                        if(res.data.error.returnCode == 200){
                            sessionStorage.setItem("userinfo", JSON.stringify(res.data));
                            $rootScope.userinfo = res.data;
                            _aside.init(res.data.role);
                            $state.go("main");
                        }else{
                            call();
                        }
                    });
                }
            };
        }])
;