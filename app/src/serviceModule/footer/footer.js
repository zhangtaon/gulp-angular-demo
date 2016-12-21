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
