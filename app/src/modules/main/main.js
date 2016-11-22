"use strict";
angular.module("app.main", [
        'ui.router',
        'aside',
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
        "_main",
        function ($scope,$http,menus,_main) {

            //初始化侧边栏
            $scope.asideOption = {
                datas: menus.data.datas,
                spread: function(){
                    _main.domNode.toggleClass("spread");
                }
            };

        }
    ])
    .factory("_main",function(){
        return {
            domNode:null
        };
    })
    .directive("main",["_main",function(_main){
        return {
            scope:{},
            restrict: "A",
            link: function ($scope,ele,attrs) {
                _main.domNode = ele;
            }
        };
    }])
;
