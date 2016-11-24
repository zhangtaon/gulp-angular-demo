"use strict";
angular.module("app.main", [
        'ui.router',
        'aside',
        'dom',
        'ui.bootstrap',
        'app.test',
        'app.about'
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
    .controller("mainCtrl", [
        "$scope",
        "$http",
        "menus",
        "_dom",
        function ($scope,$http,menus,_dom) {

            console.log("test browerify aaa");
            //初始化侧边栏
            $scope.asideOption = {
                //侧边栏所需数据
                datas: menus.data.datas,
                //侧边栏隐藏显示
                spread: function(){
                    _dom.main.toggleClass("spread");
                }
            };

        }
    ])
;
