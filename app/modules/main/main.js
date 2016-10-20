"use strict";
angular.module("app.main", ['ui.router','aside'])
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
            $locationProvider.hashPrefix('!');

            // You can also load via resolve
            $stateProvider
                .state('main', {
                    url: "/main", // root route
                    controller: 'mainCtrl', // This view will use AppCtrl loaded below in the resolve
                    templateUrl: 'modules/main/main.html'
                });
            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("mainCtrl", ["$scope",function ($scope) {
        /*$scope.asideOption = {
            datas: [
                {
                    href:"Home",
                    title:"Home",
                    items: [
                        {href:"test1",title:"test1"},
                        {href:"test2",title:"test2"},
                        {href:"test3",title:"test3"},
                        {href:"test4",title:"test4"},
                        {href:"test5",title:"test5"}
                    ]
                },
                {
                    href:"About",
                    title:"About",
                    items: [
                        {href:"test4",title:"zto"},
                        {href:"test5",title:"zto1"}
                    ]
                },
                {
                    href:"Projects",
                    title:"Projects",
                    items: [

                    ]
                },
                {
                    href:"Blog",
                    title:"Blog",
                    items: [

                    ]
                }
            ]
        };*/
        $scope.menus = [
            {
                href:"Home",
                title:"Home",
                items: [
                    {href:"test1",title:"test1"},
                    {href:"test2",title:"test2"},
                    {href:"test3",title:"test3"},
                    {href:"test4",title:"test4"},
                    {href:"test5",title:"test5"}
                ]
            },
            {
                href:"About",
                title:"About",
                items: [
                    {href:"test4",title:"zto"},
                    {href:"test5",title:"zto1"}
                ]
            },
            {
                href:"Projects",
                title:"Projects",
                items: [

                ]
            },
            {
                href:"Blog",
                title:"Blog",
                items: [

                ]
            }
        ];

/*
        $scope.getFirstClass = function(title){
            return {active: title == $scope.firstActive};
        };
        $scope.getSecondClass = function(title){
            return {active: title == $scope.secondActive};
        };
        $scope.select = function(tab,$event){
            var target = angular.element($event.target);
            if(Number(target.attr("data-level"))==2){
                console.log('number');
                $scope.secondActive = target.attr("data-title");
            } else {
                if($scope.firstActive != tab.title){
                    $scope.secondActive = "";
                }
            }
            $scope.firstActive = tab.title;
        };*/
    }]);
