/**
 * dom指令
 * 以键值对的方式存储基于jqlite包装后的dom对象，
 * 基于jqlite操作dom
 *
 * Created by zto on 2016/11/22.
 *
 *
 * dom case:
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
 *
 *
 * bindVerify case:
 * <input type="password" ng-model="registerModel.password" class="form-control" id="password" name="password" placeholder="密码" required>
 * <input type="password" ng-model="verifyPass" class="form-control" id="verifyPass" name="verifyPass" placeholder="确认密码" bind-verify="{{registerModel.password}}" required>
 *
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
     * 封装jqlite对象
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
    /**
     * 验证指令：确认密码
     */
    .directive("bindVerify", [function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, elm, attr, ctrl) {
                if (!ctrl) {
                    return;
                }
                var bindVal;
                attr.$observe('bindVerify', function(value) {
                    bindVal = value;
                    ctrl.$validate();
                });
                ctrl.$validators.bindVerify = function(modelValue, viewValue) {
                    return ctrl.$isEmpty(viewValue) || viewValue === bindVal;
                };
            }
        };
    }])
;