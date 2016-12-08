"use strict";

/**
 * 异步请求信息提示框
 *
 * Created by zto on 2016/10/20.
 */
angular.module("alert", [])
    .directive("alert", ["_alert",function (_alert) {
        return{
            restrict: "A",
            scope: {},
            replace: true,
//            templateUrl: '<div class="warning">提示信息</div>',
            template: '<div class="alert alert-danger warning-msg">提示信息</div>',
            link: function ($scope,ele) {
                _alert.domNode = ele;
            }
        };
    }])
    /**
     * 如果用户已经登录，根据用户角色获取侧边栏数据
     */
    .factory("_alert",  ["$timeout",function ($timeout) {
            /**
             * 异步请求信息提示框
             */
            var alert = {
                domNode: null,
                status: false,
                show:function (msg){
                    var _this = this;
                    this.status = true;
                    this.domNode.css("top","60px");
                    this.domNode.text(msg);
                    $timeout(function(){
                        _this.domNode.css("top","0px");
                        _this.status = false;
                    },2500);
                }
            };
            return alert;
        }]
    )
;