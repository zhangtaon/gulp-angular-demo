(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("../src/app");
require("../src/service/interceptor");
require("../src/serviceModule/browserify");
require("../src/directive/browserify");
require("../src/module/browserify");
},{"../src/app":2,"../src/directive/browserify":5,"../src/module/browserify":8,"../src/service/interceptor":16,"../src/serviceModule/browserify":10}],2:[function(require,module,exports){
"use strict";

/**
 * 项目启动入口文件
 * Created by zto on 2016/9/20.
 */
angular.module("app", [
    "ui.router",
    'app.directive',
    'app.serviceModule',
    'app.module'
]).config([
    "$httpProvider",
    "$stateProvider",
    "$locationProvider",
    "$urlRouterProvider",
    function ($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");
        $locationProvider.html5Mode(false);
        $httpProvider.interceptors.push("Interceptor");
    }])
    .run([
        "$rootScope",
        "$state",
        "_aside",
        "_dom",
        function($rootScope,$state,_aside,_dom){

            $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState){
                
                //_dom服务重置ele列表
                _dom.reset();

                var token = sessionStorage.getItem("token");

                //token有效
                if(token){
                    if(toState.name =='login'){
                        event.preventDefault();
                        $state.go("main");
                    } else if(toState.name === "main"){
                        //略过main 注：main不在验证路由有效性的范围
                        return;
                    } else {
                        //除以上情况外，所有路由都要验证有效性
                        _aside.hasAuth(toState.name).then(function(auth){
                            if(!auth){
                                event.preventDefault();
                                $state.go("main");
                            }
                        });
                    }
                }else{
                    // token无效 如果访问内部页就返回到登录页(注：此处要过滤掉所有的外部url及未登录的url)
                    if(toState.name !='login' && toState.name !='register'){
                        event.preventDefault();
                        $state.go("login",{from:fromState.name,w:'notLogin'});
                    }
                }

            });
        }
    ]);
},{}],3:[function(require,module,exports){
"use strict";

/**
 * 异步请求信息提示框
 *
 * Created by zto on 2016/10/20.
 */
angular.module("app.directive")
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
"use strict";

/**
 * 工具模块
 * Created by zto on 2016/11/25.
 */
angular.module("app.directive", [
    "ui.bootstrap",
    "ngMessages"
]);

require("./aside/aside");
require("./dom/dom");
require("./alert/alert");

},{"./alert/alert":3,"./aside/aside":4,"./dom/dom":6}],6:[function(require,module,exports){
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
angular.module("app.directive")
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
                        $log.error("dom指令使用失败，当前页面已存在dom-key为"+ key + "的节点，"+ "请重新指定dom-key的值");
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
},{}],7:[function(require,module,exports){
"use strict";

/**
 * Created by zto on 2016/10/20.
 */
angular.module("app.module")
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider) {
            $stateProvider
                .state('main.about', {
                    url: "/about",
                    controller: 'aboutCtrl',
                    templateUrl: '/src/module/about/about.html'
                });

            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("aboutCtrl", ["$scope","$http","_alert",function ($scope,$http,_alert) {

        $http({
            url: "/demo1/"+"rentinting"+"/name",
            method: 'get',
            params: {zto:10,cc:20,sn:30}
        }).then(function (res) {
            _alert.show("aboutCtrl get demo1 success");
            console.log("post:", res.data.data);
        }, function (res) {
            console.log("post:", res);
        });
    }]

);

},{}],8:[function(require,module,exports){
"use strict";
/**
 * 业务模块
 * Created by zto on 2016/11/25.
 */
angular.module("app.module", []);

require("./about/about");
require("./test/test");
},{"./about/about":7,"./test/test":9}],9:[function(require,module,exports){
"use strict";

/**
 * Created by zto on 2016/10/20.
 */
angular.module("app.module")
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",function ($stateProvider, $locationProvider) {
            $stateProvider
                .state('main.test', {
                    url: "/test",
                    controller: 'testCtrl',
                    templateUrl: '/src/module/test/test.html'
                });

            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("testCtrl", ["$scope","$http","_alert",function ($scope,$http,_alert) {
        $http({
            url: "/demo2",
            method: 'put',
            data: {zto:10,cc:20}
        }).then(function (res) {
            _alert.show(res.data.error.returnMessage);
        }, function (res) {
            console.log("post:", res);
        });
        console.log("dddk");
    }]
);

},{}],10:[function(require,module,exports){
"use strict";
/**
 * 非业务功能模块
 * Created by Administrator on 2016/12/1.
 */
angular.module("app.serviceModule", []);

/**
 * 非业务功能模块
 * Created by zto on 2016/11/25.
 */
require("./main/main");
require("./login/login");
require("./register/register");
require("./header/header");
require("./footer/footer");
},{"./footer/footer":11,"./header/header":12,"./login/login":13,"./main/main":14,"./register/register":15}],11:[function(require,module,exports){
'use strict';

angular.module('app.serviceModule')

.controller('FooterCtrl', [
        '$scope',
        function($scope) {
            $scope.$on('login', function() {
                $scope.logined = true;
            });
        }]
    );

},{}],12:[function(require,module,exports){
'use strict';

angular.module('app.serviceModule')

.controller('HeaderCtrl', [
        '$scope',
        '_loginService',
        function($scope,_loginService) {
            $scope.userinfo = JSON.parse(sessionStorage.getItem("userinfo"));

            $scope.logout = function(){
              _loginService.logout().then(function(){
                  $scope.userinfo = null;
              });
            };

            $scope.$on('login', function() {
                $scope.userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
            });
        }]
    );

},{}],13:[function(require,module,exports){
"use strict";

/**
 * 登录模块
 * Created by zto on 2016/10/20.
 */
angular.module("app.serviceModule")
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function ($stateProvider) {
            $stateProvider
                .state('login', {
                    url: "/login",
                    controller: 'loginCtrl',
                    templateUrl: '/src/serviceModule/login/login.html'
                });
        }
    ])
    .controller("loginCtrl", [
        "$scope",
        "$rootScope",
        "_loginService",
        "$state",
        function ($scope, $rootScope, _loginService, $state) {

            /**
             * 监听变量 发生变化重置 logined 状态
             */
            $scope.$watch("loginModel.account",function(){
                $scope.logined = true;
            });
            $scope.$watch("loginModel.password",function(){
                $scope.logined = true;
            });

            /**
             * 登录
             * @param valid 表单验证结果 true 验证通过，false 验证未通过
             */
            $scope.login = function (valid) {
                $scope.submitted = true;

                //表单验证通过，登录系统
                valid && _loginService.login($scope.loginModel).then(function(){

                    //登录成功 从根作用域发射事件
                    $rootScope.$broadcast('login');

                },function(){

                    //登录失败，控制错误信息显示
                    $scope.logined = false;

                });// jshint ignore:line
            };

            /**
             * 跳转注册页
             */
            $scope.register = function () {
                $state.go("register");
            };
        }
    ])
    .factory("_loginService",[
        "$http",
        "_aside",
        "$state",
        "$rootScope",
        "$log",
        "$q",
        function($http,_aside,$state,$rootScope,$log,$q){
            return {
                /**
                 * 登录
                 * @param model 登录数据封装
                 * @returns {defer.promise|*}
                 */
                login: function(model){
                    var defer = $q.defer();
                    $http.post("/login",model).then(function (res) {
                        if(res.data.error.returnCode == 200){
                            sessionStorage.setItem("userinfo", JSON.stringify(res.data.data));
                            $rootScope.userinfo = res.data.data;
                            _aside.init(res.data.data.role);
                            $state.go("main");
                            defer.resolve();
                        }else{
                            defer.reject();
                        }
                    });
                    return defer.promise;
                },
                /**
                 * 退出
                 */
                logout: function(){
                    var defer = $q.defer();
                    $http.post("/logout").then(function (res) {
                        if(res.data.error.returnCode == 200){
                            sessionStorage.removeItem("token");
                            sessionStorage.removeItem("userinfo");
                            $rootScope.userinfo = null;
                            $state.go("login");
                            defer.resolve();
                        }else{
                            defer.reject();
                            $log.warn("退出失败");
                        }
                    });
                    return defer.promise;
                }
            };
        }])
;
},{}],14:[function(require,module,exports){
"use strict";

/**
 * 业务框架模块
 * 左：菜单
 * 右：页面内容
 * Created by zto on 2016/10/20.
 */
angular.module("app.serviceModule")
    .config([
        "$stateProvider",
        function ($stateProvider) {
            $stateProvider
                .state('main', {
                    url: "/main",
                    controller: 'mainCtrl',
                    templateUrl: '/src/serviceModule/main/main.html',
                    resolve: {
                        menus: ["_aside",function(_aside){
                            return _aside.data;
                        }]
                    }
                });
        }
    ])
    .controller("mainCtrl", [
        "$scope",
        "$http",
        "menus",
        "_dom",
        function ($scope,$http,menus,_dom) {
            //初始化侧边栏
            $scope.asideOption = {
                //侧边栏所需数据
                datas: menus.data.data,
                //侧边栏隐藏显示
                spread: function(){
                    _dom.get("main").toggleClass("spread");
                }
            };
        }
    ])
;

},{}],15:[function(require,module,exports){
"use strict";

/**
 * 注册模块
 * Created by zto on 2016/12/2.
 */
angular.module("app.serviceModule")
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function ($stateProvider) {
            $stateProvider
                .state('register', {
                    url: "/register",
                    controller: 'registerCtrl',
                    templateUrl: '/src/serviceModule/register/register.html'
                });
        }
    ])
    .controller("registerCtrl", [
        "$scope",
        "$rootScope",
        "_registerService",
        function ($scope, $rootScope, _registerService) {
            $scope.register = function (valid) {
                $scope.submitted = true;
                valid && _registerService.register($scope.registerModel);// jshint ignore:line
            };
        }
    ])
    .factory("_registerService",[
        "$http",
        function($http){
            return {
                register: function(data){
                    $http.post("/register",data).then(function (res) {
                        if(res.data.error.returnCode == 200){
                            console.log("ok res:",res.data.error.returnMessage);
                        }
                    });
                }
            };
        }])
;
},{}],16:[function(require,module,exports){
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
        function ($q,$rootScope,$log,$location) {
            return {
                request: function (config) {
//                    X-Requested-With:XMLHttpRequest
                    config.headers.token = sessionStorage.getItem("token");
                    return config;
                },
                response: function (resp) {
                    if (resp.config.url == '/login' && resp.data.error.returnCode==200) {
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
},{}]},{},[1]);
