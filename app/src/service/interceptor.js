"use strict";

/**
 * http拦截器
 * 注：封装登录token
 * Created by zto on 2016/10/20.
 */
angular.module("app")
    .factory('Interceptor', [
        "$q",
        "$rootScope",
        "$log",
        "$location",
        "_alert",
        function ($q,$rootScope,$log,_alert) {
            return {
                request: function (config) {
                    config.headers["X-Requested-With"] = "XMLHttpRequest";
                    return config;
                },
                response: function (resp) {
                   /* if (resp.config.url == '/login' && resp.data.error.returnCode==200) {
                        sessionStorage.setItem("token", resp.config.headers.token || resp.data.token);
                    }*/
                    return resp;
                },
                responseError: function (rejection) {
                    //错误处理
                    switch (rejection.status) {
                        case 401:
                            sessionStorage.setItem("token", null);
                            sessionStorage.setItem("userinfo", null);
                            $log.log("auth:loginRequired");
                            break;
                        case 403:
                            $log.warn("auth:forbidden");
                            _alert.show("接口被屏蔽");
                            break;
                        case 404:
                            $log.warn("url:notFound");
                            _alert.show("请求的接口不存在");
                            break;
                        case 405:
                            _alert.show("接口不允许访问");
                            $log.warn("method:notAllowed");
                            break;
                        case 500:
                            _alert.show("服务器错误");
                            $log.error("server:error");
                            break;
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ]);