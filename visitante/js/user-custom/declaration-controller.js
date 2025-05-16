/**
 * Created by chenqk on 2018/6/6.
 */
/**
 * Created by chenqk on 2018/6/6.
 */

angular.module('main')
    .controller("declarationController", ["$scope","$translate",'$http','mainActionService','$window',function ($scope,$translate,$http,mainActionService,$window) {
        $scope.termsOfUser = "";
        var vm = this;
        mainActionService.decorator(vm, $scope);
    $scope.backToLogin = function (){
        $window.history.back(1);
      };

    }]);