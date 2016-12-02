/**
 * dom指令
 * 以键值对的方式存储基于jqlite包装后的dom对象，
 * 基于jqlite操作dom
 *
 * Created by zto on 2016/11/22.
 *
 *
 * case:
 *
 * html
 * <div dom dom-key="main" class="main" ui-view></div>
 *
 * js
 * controller("mainCtrl", [
 *      "_dom",
 *      function (_dom) {
 *            _dom.get("main").toggleClass("spread");
 *      }
 *  ])
 */

"use strict";
angular.module("dom", [])
    .directive("dom", ["_dom",function (_dom) {
        return {
            scope:{},
            restrict: "A",
            link: function ($scope,ele,attrs) {
                _dom.set(attrs.domKey,ele);
            }
        };
    }])
    /**
     * 如果用户已经登录，根据用户角色获取侧边栏数据
     */
    .factory("_dom",["$log",function ($log) {
        var _dom = {};
            return {
                set: function(key,ele){
                    if(_dom[key]){
                        $log.error("dom指令使用失败，当前页面已存在dom-name为"+ key + "的节点，"+ "请重新指定dom-name的值");
                    }else {
                        _dom[key] = ele;
                    }
                },
                get: function(key){
                    return _dom[key];
                },
                reset: function(){
                    _dom = {};
                }
            };
        }]
    )
;