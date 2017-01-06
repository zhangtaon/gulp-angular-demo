"use strict";

/**
 * 业务框架模块
 * 左：菜单
 * 右：页面内容
 * Created by zto on 2016/10/20.
 */
angular.module("app.serviceModule")
    .config([
        "$stateProvider",
        function ($stateProvider) {
            $stateProvider
                .state('main', {
                    url: "/main",
                    controller: 'mainCtrl',
                    templateUrl: '/src/serviceModule/main/main.html',
                    resolve: {
                        menus: ["_aside",function(_aside){
                            return _aside.data;
                        }]
                    }
                });
        }
    ])
    .controller("mainCtrl", [
        "$scope",
        "$http",
        "menus",
        "_dom",
        function ($scope,$http,menus,_dom) {
            //初始化侧边栏
            $scope.asideOption = {
                //侧边栏所需数据
                datas: menus.data.data,
                //侧边栏隐藏显示
                spread: function(){
                    _dom.get("main").toggleClass("spread");
                }
            };
        }
    ])
;
