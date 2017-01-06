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
    .directive("aside", function () {
        return{
            restrict: "A",
            scope: {
                option: "="
            },
            replace: true,
            templateUrl: '/src/directive/aside/aside.html'
        };
    })
    /**
     * 如果用户已经登录，根据用户角色获取侧边栏数据
     */
    .factory("_aside", [
        "$http",
        "$log",
        "$q",
        function ($http, $log, $q) {
            var userinfo;
            try {
                userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
            } catch (e) {
                $log.error("$log:", e);
            }


            /**
             * 侧边栏数据对象
             */
            var aside = {
                /**
                 * 初始话菜单列表
                 * @param role
                 */
                init: function(role){
                    this.data = $http.get("role/" + role + ".json");
                },
                //菜单存储对象
                data: null,
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
            if(userinfo){
                aside.init(userinfo.role);
            }
            return aside;
        }
    ])
;