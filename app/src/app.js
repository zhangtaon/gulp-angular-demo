"use strict";
angular.module("app",[
    "ui.router",
    "app.login",
    "app.main",
]).config([
        "$httpProvider",
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/login");
            $locationProvider.html5Mode(false);

            var interceptror = function($q, $rootScope){
              return {
                  request: function(config){
                      config.headers.token = sessionStorage.getItem("token");
                      return config;
                  },
                  response: function(resp){
                    if(resp.config.url == '/login') {
                        sessionStorage.setItem("token",resp.config.headers.token || resp.data.token);
                    }
                    return resp;
                  },
                  responseError: function(rejection){
                      //错误处理
                      switch(rejection.status){
                          case 401:
                              if(rejection.config.url !== '/login'){
                                  $rootScope.$broadcast('auth:loginRequired');
                              }
                              console.log(401);
                              break;
                          case 403:
                              $rootScope.$broadcast('auth:forbidden');
                              console.log(403);
                              break;
                          case 404:
                              $rootScope.$broadcast('url:notFound');
                              console.log(404);
                              break;
                          case 405:
                              $rootScope.$broadcast('method:notAllowed');
                              console.log(405);
                              break;
                          case 500:
                              $rootScope.$broadcast('server:error');
                              console.log(500);
                              break;
                      }
                      return $q.reject(rejection);
                  }
              };
            };
            $httpProvider.interceptors.push(interceptror);
        }
    ]);