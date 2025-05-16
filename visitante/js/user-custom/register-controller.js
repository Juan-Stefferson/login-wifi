/**
 * Created by chenqk on 2018/6/6.
 */
/**
 * Created by chenqk on 2018/6/6.
 */

angular.module('main')
    .controller("registerController", function ($window, $scope, $translate, $http, $timeout, mainActionService, mainService) {
        var vm = this;
        vm.welcomeLinkedURL = welcomeLinkedURL;
        vm.successLinkedURL = successLinkedURL;
        vm.welcome_logo = welcome_logo;
        vm.success_logo = success_logo;
        vm.locationEnable = locationEnable;
        vm.locationList = locationList;
        vm.successNotification = successNotification;
        vm.authorizeVerificationCode = authorizeVerificationCode;
		vm.emailRestriction = emailRestriction;
        vm.backToLogin = function () {
            $window.history.back();
        };
        vm.reqiredAttributes = reqiredAttributes;
        vm.selectEmployEmail = allowedEmailSuffix.length > 0 ? allowedEmailSuffix[0] : "";
        vm.allowedEmailSuffix = allowedEmailSuffix;
		$scope.selfRegisterCustomAttrList = selfRegisterCustomAttrList;
        vm.welcomeLogoBgColor = typeof(welcomeLogoBgColor) === "undefined" ? null : welcomeLogoBgColor;
        vm.welcomeBgColor = (typeof (welcomeBgColor) === "undefined" || !welcomeBgColor) ? "rgb(255, 250, 253, 0.9)" : welcomeBgColor;
        vm.welcomeBgSrc = (typeof (welcome_bg_src) === "undefined" || !welcome_bg_src) ? "img/bg-default.jpg" : welcome_bg_src;
        vm.successBgSrc = (typeof (success_bg_src) === "undefined" || !success_bg_src) ? "img/bg-default.jpg" : success_bg_src;
        
        $scope.welcomeLogoBg = mainService.setLogoBackground(vm.welcomeLogoBgColor);
        $scope.welcomeBgColorStyle = mainService.setBgStyle(vm.welcomeBgColor);
        //Background image and advertise picture
        $scope.welcomeBgStyle = mainService.setBgStyle(null, vm.welcomeBgSrc, 'no-repeat');
        $scope.successBgStyle = mainService.setBgStyle(null, vm.successBgSrc, 'no-repeat');

		if ($scope.selfRegisterCustomAttrList != null && $scope.selfRegisterCustomAttrList.length != 0) {
			$scope.selfRegisterCustomAttrList.forEach(function(item, index){
				item.value = null;
				item.attrName = "selfRegisterCustomAttrList" + index;
			});
		}


		$scope.updateAttrList = function(index, attr) {
			if ($scope.timer) {
				$timeout.cancel($scope.timer);
			}
			$scope.timer = $timeout(function(){
				$scope.selfRegisterCustomAttrList[index].value = attr.value;
			}, 600);
		};

        mainActionService.decorator(vm, $scope);
    });
