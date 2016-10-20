/**
 * 侧边栏指令
 * option为指定的配置参数,他的值为绑定在所在模块控制器作用域上的属性
 * option：{
        datas：
        [
            {
                href:"Home",
                title:"Home",
                items: [
                    {href:"test1",title:"test1"},
                    {href:"test2",title:"test2"}
                ]
              },
            {
                href:"Projects",
                title:"Projects",
                items: [

                ]
            }
        ]
    }
 * Created by zto on 2016/10/20.
 */

"use strict";
angular.module("aside", [])
    .directive("aside", function () {
        return{
            restrict: "A",
            scope: {
                option: "="
            },
            replace: true,
            templateUrl: '/src/directive/aside/aside.html',
            controller: function ($scope,$http) {
                $scope.menus = $scope.option.datas;
                $scope.getFirstClass = function (title) {
                    return {active: title == $scope.firstActive};
                };
                $scope.getSecondClass = function (title) {
                    return {active: title == $scope.secondActive};
                };
                $scope.select = function (tab, $event) {
                    var target = angular.element($event.target);
                    if (Number(target.attr("data-level")) == 2) {
                        $scope.secondActive = target.attr("data-title");
                    } else {
                        if ($scope.firstActive != tab.title) {
                            $scope.secondActive = "";
                        }
                    }
                    $scope.firstActive = tab.title;
                };
            }
        }
    });