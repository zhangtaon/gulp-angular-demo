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
        ],
        注：隐藏侧边栏
        spread: function(){
                }
    }

 * _aside服务应用于多个依赖（app、main）
 *
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
            templateUrl: 'src/directive/aside/aside.html'
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
                init: function(role){
                    this.data = $http.get("role/" + role + ".json");
                },
                data: null,
                hasRole: function(stateName){
                    var defer = $q.defer(),hasAuth;
                    if(this.data){
                        this.data.then(function(res){
                            for(var i= 0,item;(item = res.data.datas[i]);i++){
                                if(stateName === item.ref){
                                    hasAuth = true;
                                    break;
                                }
                                for(var j= 0,_item;(_item = item.items[j]);j++){
                                    if(stateName === _item.ref){
                                        hasAuth = true;
                                        break;
                                    }
                                }
                                if(hasAuth){
                                    break;
                                }
                            }
                            defer.resolve(hasAuth);
                        });
                    }
                    return defer.promise;
                }
            };
            if(userinfo){
                aside.init(userinfo.role);
            }
            return aside;
        }
    ])
;