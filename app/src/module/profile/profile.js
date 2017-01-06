"use strict";

/**
 * Created by zto on 2016/10/20.
 */
angular.module("app.module")
    .config([
        "$stateProvider",
        "$locationProvider",
        "$urlRouterProvider",
        function ($stateProvider, $locationProvider) {
            $stateProvider
                .state('profile', {
                    url: "/profile",
                    controller: 'profileCtrl',
                    templateUrl: '/src/module/profile/profile.html',
                    resolve: {
                        user: ["_profile",function(_profile){
                            return _profile.getProfile();
                        }]
                    }
                });

            // Without server side support html5 must be disabled.
            $locationProvider.html5Mode(false);
        }
    ])
    .controller("profileCtrl", ["$rootScope","$scope","user","_alert",function ($rootScope,$scope,user) {
        $scope.user = user.data.data;
        sessionStorage.setItem("userinfo", JSON.stringify(user.data.data));
    }])
    .factory("_profile",["$http",function($http){
            return {
                getProfile: function(){
                    return $http.get("/profile/get-profile");
                }
            };
        }]
    )
;
