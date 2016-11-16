"use strict";
/**
 * http拦截器
 * 注：封装登录token
 */
angular.module("app")
    .factory('Interceptor', [
        "$q",
        "$rootScope",
        "$log",
        "$location",
        function ($q,$rootScope,$log,$location) {
            return {
                request: function (config) {
                    config.headers.token = sessionStorage.getItem("token");
                    return config;
                },
                response: function (resp) {
                    if (resp.config.url == '/login') {
                        sessionStorage.setItem("token", resp.config.headers.token || resp.data.token);
                    }
                    return resp;
                },
                responseError: function (rejection) {
                    //错误处理
                    switch (rejection.status) {
                        case 401:
                            if (rejection.config.url !== '/login') {
                                sessionStorage.setItem("token", null);
                                sessionStorage.setItem("userinfo", null);
                                $log.log("auth:loginRequired");
                            }
                            $location.url("/login");
                            break;
                        case 403:
                            $log.warn("auth:forbidden");
                            break;
                        case 404:
                            $log.warn("url:notFound");
                            break;
                        case 405:
                            $log.warn("method:notAllowed");
                            break;
                        case 500:
                            $log.error("server:error");
                            break;
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ]);