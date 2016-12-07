'use strict';

angular.module('app.header', [])

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
