/**
 * 侧边栏指令
 *
 * 所需数据结构
 "data": [
     {
          "id":"0",
          "name":"用户信息",
          "url":"profile"
      },
     {
         "id":"1",
         "name":"工单管理",
         "url":"/ticket/index"
     },
     {
         "id": "2",
         "name": "用户映射",
         "url": "/ticket/index",
         "children": [
             {
                 "id":"3",
                 "name":"test二级菜单",
                 "url":"/ticket/test",
                 "children": [
                     {
                         "id":"4",
                         "name":"三级菜单1",
                         "url":"profile1"
                     },
                     {
                         "id":"5",
                         "name":"三级菜单2",
                         "url":"/ticket/index1",
                         "children": [
                             {
                                 "id":"4",
                                 "name":"四级菜单1",
                                 "url":"profile1"
                             },
                             {
                                 "id":"5",
                                 "name":"四级菜单2",
                                 "url":"/ticket/index1"
                             }
                         ]
                     }
                 ]
             }
         ]
     }
 ]

 注：隐藏侧边栏
 spread: function(){

 }

 * _aside服务应用于多个依赖（app、main）
 *
 * Created by zto on 2016/10/20.
 */

"use strict";
angular.module("app.directive")
    .directive("aside", ["_aside","_dom",function (_aside,_dom) {
        return{
            restrict: "A",
            replace: true,
            templateUrl: '/src/directive/aside/aside.html',
            controller: function($scope){
                //侧边栏隐藏显示
                $scope.spread = function(){
                    _dom.get("main").toggleClass("spread");
                };
                _aside.data.then(function(res){
                    $scope.datas = res.data.data;
                })
            }
        };
    }])
    /**
     * 如果用户已经登录，根据用户角色获取侧边栏数据
     */
    .factory("_aside", [
        "$http",
        "$log",
        "$q",
        function ($http, $log, $q) {
            /**
             * 侧边栏数据对象
             */
            var aside = {
                /**
                 * 菜单列表存储对象
                 */
                data: $http.get("/profile/get-menus"),
                /**
                 * 验证是否有权限去访问菜单对应的页面
                 * @param stateName
                 * @returns {*}
                 */
                hasAuth: function(stateName){
                    var defer = $q.defer(),_this = this;
                    _this.data.then(function(res){
                        defer.resolve(_this.validState(res.data.data,stateName));
                    });
                    return defer.promise;
                },
                /**
                 * 验证路由的有效性
                 * @param arr
                 * @param stateName
                 * @returns {*}
                 */
                validState: function(arr,stateName){
                    var hasAuth;

                    for(var i= 0,item;(item = arr[i]);i++){
                        if(stateName.indexOf(item.url)>-1){
                            hasAuth = true;
                            break;
                        }
                        if(item.children && (hasAuth = this.validState(item,stateName))){
                            break;
                        }
                    }
                    return hasAuth;
                }
            };
            return aside;
        }
    ])
;