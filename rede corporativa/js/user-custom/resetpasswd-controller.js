(function () {
    'use strict';

    angular.module("main")
        .controller("resetPasswdController", resetPasswdCtrl);

    resetPasswdCtrl.$inject = ['$scope', '$timeout', '$translate', 'mainActionService', '$q', '$http', '$window', 'mainService'];

    function resetPasswdCtrl($scope, $timeout, $translate, mainActionService, $q, $http, $window, mainService) {
        var vm = this;
        vm.useFor = useFor;
        vm.loginBy = loginBy;
        vm.pwdReset = pwdReset;
        vm.verifyVia = vm.pwdReset == 3 ? 1: vm.pwdReset;
        vm.timer = null;
        vm.timingFlag = false;
        $scope.timing = {
            timing: 0
        };

        vm.welcome_logo = welcome_logo;
        vm.welcomeLogoBgColor = typeof(welcomeLogoBgColor) === "undefined" ? null : welcomeLogoBgColor;
        vm.welcomeBgColor = (typeof (welcomeBgColor) === "undefined" || !welcomeBgColor) ? "rgb(255, 250, 253, 0.9)" : welcomeBgColor;
        vm.welcomeBgSrc = (typeof (welcome_bg_src) === "undefined" || !welcome_bg_src) ? "img/bg-default.jpg" : welcome_bg_src;
        vm.successBgSrc = (typeof (success_bg_src) === "undefined" || !success_bg_src) ? "img/bg-default.jpg" : success_bg_src;

        $scope.welcomeLogoBg = mainService.setLogoBackground(vm.welcomeLogoBgColor);
        $scope.welcomeBgColorStyle = mainService.setBgStyle(vm.welcomeBgColor);

        //Background image and advertise picture
        $scope.welcomeBgStyle = mainService.setBgStyle(null, vm.welcomeBgSrc, 'no-repeat');
        $scope.successBgStyle = mainService.setBgStyle(null, vm.successBgSrc, 'no-repeat');

        mainActionService.decorator(vm, $scope);

        /**
         * Count Down
         * @param {Int} maxTime --unit:second
         */
        function countDown () {
            if (vm.timer) {
                $timeout.cancel(vm.timer);
            }
            if (vm.maxTime > 0) {
                $scope.timing.timing = vm.maxTime;
                --vm.maxTime;
                vm.timer = $timeout(function(){
                    countDown();
                }, 1000);
            } else {
                vm.timingFlag = false;
                $timeout.cancel(vm.timer);
            }
        }

        /**
         * Trigger Count Down
         */
        function triggerCountDown () {
            //start timing
            vm.maxTime = 120;
            vm.timingFlag = true;
            countDown();
        }

        vm.sendVerifyCode = function sendVerifyCode (url, data) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: data
            }).then(function (resp) {
                if (resp) {
                    defer.resolve(resp.data);
                } else {
                    defer.reject(resp);
                }
            });
            return defer.promise;
        };

        vm.getVerifyCode = function getVerifyCode () {
            var url = "";
            var reqData = {
                username: '',
                languageRegistration: ''
            };
           
            //set request to server
            if (vm.verifyVia == 1) {
                url = "/portal/api/ham/guestAccount/email";
            } else {
                url = "/portal/api/ham/guestAccount/sms";
            }
            reqData.username = vm.username;
            reqData.languageRegistration = $translate.use();
            vm.sendVerifyCode(url, reqData)
                .then(function (respData) {
                    if (respData.errorCode == 0) {
                        vm.receiveTarget = respData.data;
                        triggerCountDown();
                        vm.action.openDialog(false, respData.result);
                    } else {
                        //report error
                        vm.action.openDialog(true, respData.errorMessage);
                    }
                });
        };

        /**
         * Back to Login page
         */
        vm.backToLogin = function backToLogin () {
            $window.history.back();
        };

        /**
         * Reset Password
         */
        vm.resetPasswd = function resetPasswd () {
            var reqData = {};
            reqData.username = vm.username;
            reqData.newPassword = vm.newPasswd;
            reqData.newPasswordConfirm = vm.confirmPasswd;
            reqData.verificationCode = vm.verifyCode;
            $http({
                method: 'POST',
                url: '/portal/api/ham/guestAccount/reset',
                data: reqData
            }).then(function (resp) {
                if (resp.data.errorCode == 0) {
                    vm.action.openDialog(false, "resetpasswd.resetSucceed", false, vm.backToLogin);
                } else {
                    vm.action.openDialog(true, resp.data.errorMessage);
                }
            });
        };
    }
})();