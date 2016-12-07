"use strict";

/**
 * 登录模块
 * Created by zto on 2016/10/20.
 */
angular.module("app.login", [])
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

            /**
             * 监听变量 发生变化重置 logined 状态
             */
            $scope.$watch("loginModel.account",function(){
                $scope.logined = true;
            });
            $scope.$watch("loginModel.password",function(){
                $scope.logined = true;
            });

            /**
             * 登录
             * @param valid 表单验证结果 true 验证通过，false 验证未通过
             */
            $scope.login = function (valid) {
                $scope.submitted = true;

                //表单验证通过，登录系统
                valid && _loginService.login($scope.loginModel).then(function(){

                    //登录成功 从根作用域发射事件
                    $rootScope.$broadcast('login');

                },function(){

                    //登录失败，控制错误信息显示
                    $scope.logined = false;

                });// jshint ignore:line
            };

            /**
             * 跳转注册页
             */
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
        "$log",
        "$q",
        function($http,_aside,$state,$rootScope,$log,$q){
            return {
                /**
                 * 登录
                 * @param model 登录数据封装
                 * @returns {defer.promise|*}
                 */
                login: function(model){
                    var defer = $q.defer();
                    $http.post("/login",model).then(function (res) {
                        if(res.data.error.returnCode == 200){
                            sessionStorage.setItem("userinfo", JSON.stringify(res.data.data));
                            $rootScope.userinfo = res.data.data;
                            _aside.init(res.data.data.role);
                            $state.go("main");
                            defer.resolve();
                        }else{
                            defer.reject();
                        }
                    });
                    return defer.promise;
                },
                /**
                 * 退出
                 */
                logout: function(){
                    var defer = $q.defer();
                    $http.post("/logout").then(function (res) {
                        if(res.data.error.returnCode == 200){
                            sessionStorage.removeItem("token");
                            sessionStorage.removeItem("userinfo");
                            $rootScope.userinfo = null;
                            $state.go("login");
                            defer.resolve();
                        }else{
                            defer.reject();
                            $log.warn("退出失败");
                        }
                    });
                    return defer.promise;
                }
            };
        }])
;