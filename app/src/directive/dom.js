/**
 * dom指令
 * 以键值对的方式存储基于jqlite包装后的dom对象，
 * 基于jqlite操作dom
 *
 * Created by zto on 2016/11/22.
 */

"use strict";
angular.module("dom", [])
    .directive("dom", ["_dom","$log",function (_dom,$log) {
        return {
            scope:{},
            restrict: "A",
            link: function ($scope,ele,attrs) {
                if(_dom[attrs.domKey]){
                    $log.error("dom指令使用失败，已存在dom-name为"+ attrs.domKey + "的节点，"+ "请重新指定dom-name的值");
                }else{
                    _dom[attrs.domKey] = ele;
                }
            }
        };
    }])
    /**
     * 如果用户已经登录，根据用户角色获取侧边栏数据
     */
    .factory("_dom",function () {
            return {};
        }
    )
;