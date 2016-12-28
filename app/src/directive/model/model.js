"use strict";

/**
 * 自定义模块基类
 * Created by zto on 2016/3/18.
 *
 * options:
 *
     controller: attrs.controller,      //控制器名称
     template: attrs.template,          //模板字符串
     templateUrl: attrs.templateUrl,    //模板url
     resolve: $scope.resolve,           //传入的参数
     scope: $scope,                     //需要依赖的作用域
     placeAt: ele                       //要附着的dom元素

 *
 * case：
 *
 * <div model template-url="modules/bank/bank.html" controller="bankCtrl"></div>
 *
 * or
 *
 * .controller("test", ['$model','$scope',function ($model,$scope) {
        var ele = angular.element("<div>test</div>");
        var options = {
            controller: "bankCtrl",
            templateUrl: "modules/bank/bank.html",
            resolve: {a:1,b:2},
            scope: $scope,
            placeAt: ele
        };
        $model.init(options);
    }])
 */
angular.module("app.directive", [])
    .factory("$model",['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller','$compile',
        function($injector, $rootScope, $q, $http, $templateCache, $controller,$compile){

            /**
             * 解析模板契约对象
             * @param options
             * @returns {Promise}
             */

            function getTmplPromise(options) {
                return options.template ? $q.when(options.template) :
                    $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                        {cache: $templateCache}).then(function (result) {
                            return result.data;
                        });
            }

            /**
             * 解析接受参数契约对象
             * @param resolves
             * @returns {Array}
             */
            function getResolvePromises(resolves) {
                var promisesArr = [];
                angular.forEach(resolves, function (value) {
                    if (angular.isFunction(value) || angular.isArray(value)) {
                        promisesArr.push($q.when($injector.invoke(value)));
                    }
                });
                return promisesArr;
            }

            /**
             * 基础服务
             * 提供通过作用域对控制器和模板的桥接
             * @type {{init: init}}
             */
            var model = {
                /**
                 * 实例化自定义指令控件
                 * @param options
                 */
                init: function(options){
                    var _this = this;

                    //verify options
                    if (!options.template && !options.templateUrl) {
                        throw new Error('One of template or templateUrl options is required.');
                    }

                    var templAndResolvePromise =
                        $q.all([getTmplPromise(options)].concat(getResolvePromises(options.resolve)));

                    templAndResolvePromise.then(function(tplAndVars){

                        var ctrlScope = (options.scope || $rootScope).$new(),
                            ctrlInstance, ctrlLocals = {}, resolveIter = 1;

                        //verify controller
                        if (options.controller) {

                            //给控制器注入作用域或者注入其他参数
                            ctrlLocals.$scope = ctrlScope;

//                            注入其他参数案例
//                            ctrlLocals.zto = {aaa:111,bbb:222,ccc:333};

                            //获取所有参数对象到对应的本地变量key-value数组
                            angular.forEach(options.resolve, function (value, key) {
                                if (angular.isFunction(value) || angular.isArray(value)) {
                                    ctrlLocals[key] = tplAndVars[resolveIter++];
                                }
                            });

                            //给控制器绑定作用域
                            ctrlInstance = $controller(options.controller, ctrlLocals);
                            if (options.controllerAs) {
                                ctrlScope[options.controllerAs] = ctrlInstance;
                            }

                            _this.domNode = $compile(tplAndVars[0])(ctrlScope);
                            //verify placeAt 附着到指定的元素
                            if(options.placeAt){
                                options.placeAt.append(_this.domNode);
                            }else {
                                _this.callback && _this.callback.call(_this);// jshint ignore:line
                            }
                        }else{
                            throw new Error('One of controller options is required.');
                        }
                    },function(){

                    });
                },
                callback:null
            };
            return model;
        }
    ])
    .directive("model", ['$model',function ($model) {
        return{
            restrict: "EA",
            replace: true,
            link: function($scope,ele,attrs){
                $scope.name='model';
                var options = {
                    controller: attrs.controller,
                    template: attrs.template,
                    templateUrl: attrs.templateUrl,
                    resolve: $scope.resolve,
                    scope: $scope,
                    placeAt: ele
                };
                $model.init(options);
            }
        };
    }])
;