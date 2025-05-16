/**
 * Created by chenqk on 2018/6/6.
 */
/**
 * Created by chenqk on 2018/6/6.
 */

    angular.module('main')
        .controller("facebookLoginController",function ($scope, $translate, $http,mainActionService,socialLoginService,$window, mainService) {
            var vm = this;
            vm.welcome_logo = welcome_logo;
            vm.backToLogin = function(){
                $window.history.back();
            }
            vm.reqiredAttributes = reqiredAttributes;
            vm.selectEmployEmail = '@han-networks.com';
            mainActionService.decorator(vm,$scope);
            var useragent = $window.navigator.userAgent;
            var rules = ['WebView','(iPod|iPad)(?!.*Safari\/)','Android.*(wv|\.0\.0\.0)'];
            var regex = new RegExp(rules.join('|'), 'ig');
            var  webview =  Boolean(useragent.match(regex));
            if(webview){
                vm.action.openDialog(true,'login.errorMessage.useBrowser');
            }else {
                socialLoginService.initFB(facebookID,vm,$scope);
            }

            var logoBg = typeof(welcomeLogoBgColor) === "undefined" ? null : welcomeLogoBgColor;
            vm.welcomeBgColor = (typeof (welcomeBgColor) === "undefined" || !welcomeBgColor) ? "rgb(255, 250, 253, 0.9)" : welcomeBgColor;
            vm.welcomeBgSrc = (typeof (welcome_bg_src) === "undefined" || !welcome_bg_src) ? "img/bg-default.jpg" : welcome_bg_src;
            
            $scope.logoBg = mainService.setLogoBackground(logoBg);
            $scope.welcomeBgColorStyle = mainService.setBgStyle(vm.welcomeBgColor);
            $scope.welcomeBgStyle = mainService.setBgStyle(null, vm.welcomeBgSrc, 'no-repeat');
        });
