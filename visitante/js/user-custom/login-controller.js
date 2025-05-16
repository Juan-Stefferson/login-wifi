/**
 * Created by chenqk on 2018/6/6.
 */
/**
 * Created by chenqk on 2018/6/6.
 */
angular.module('main')
    .controller("loginController", function ($window, $scope, $translate, $http, localStorageService, mainActionService, mainService, $timeout) {
        var vm = this;
        vm.loginBy = loginBy;
        vm.fixedURL = fixedURL;
        vm.successRedirect = successRedirect;
        vm.socialLogin = socialLogin;
        vm.facebookID = facebookID;
        vm.googleID = googleID;
        vm.weChatAppID = weChatAppID;
        vm.openAppId = openAppId;
        vm.rainbowID = aleRainbowOAuthClientID;
        vm.selfRegistration = selfRegistration;
        vm.welcomeLinkedURL = welcomeLinkedURL;
        vm.successLinkedURL = successLinkedURL;
        vm.welcome_logo = welcome_logo;
        vm.success_logo = success_logo;
        vm.portalServiceUrl = portalServiceUrl;
		$scope.timer = null;
        $scope.loginCustomAttrList = loginCustomAttrList;
        vm.useFor = useFor;
        vm.pwdReset = pwdReset;
        vm.welcomeLogoBgColor = typeof (welcomeLogoBgColor) === "undefined" ? null : welcomeLogoBgColor;
        vm.successLogoBgColor = typeof (successLogoBgColor) === "undefined" ? null : successLogoBgColor;
        vm.welcomeBgColor = (typeof (welcomeBgColor) === "undefined" || !welcomeBgColor) ? "rgb(255, 250, 253, 0.9)" : welcomeBgColor;
        vm.successBgColor = (typeof (successBgColor) === "undefined" || !successBgColor) ? "rgb(255, 250, 253, 0.9)" : successBgColor;
        vm.welcomeBgSrc = (typeof (welcome_bg_src) === "undefined" || !welcome_bg_src) ? "img/bg-default.jpg" : welcome_bg_src;
        vm.successBgSrc = (typeof (success_bg_src) === "undefined" || !success_bg_src) ? "img/bg-default.jpg" : success_bg_src;

        $scope.welcomeLogoBg = mainService.setLogoBackground(vm.welcomeLogoBgColor);
        $scope.successLogoBg = mainService.setLogoBackground(vm.successLogoBgColor);

        $scope.welcomeBgColorStyle = mainService.setBgStyle(vm.welcomeBgColor);
        $scope.successBgColorStyle = mainService.setBgStyle(vm.successBgColor);
        $scope.welcomeBgStyle = mainService.setBgStyle(null, vm.welcomeBgSrc, 'no-repeat');
        $scope.successBgStyle = mainService.setBgStyle(null, vm.successBgSrc, 'no-repeat');
        vm.dataQuotaUrl = dataQuotaUrl;

		vm.isHasCustomAttr = function() {
			if ($scope.loginCustomAttrList != null && $scope.loginCustomAttrList.length != 0) {
				return true;
			}
			return false;
		};

		if (vm.isHasCustomAttr()) {
			$scope.loginCustomAttrList.forEach(function(item, index){
				item.value = null;
				item.attrName = "loginCustomAttr" + index;
			});
		}

        var reqCount = 0;
        mainActionService.decorator(vm, $scope);
        vm.action.login = function () {
            vm.block = true;
            rememberMe();
            if (useFor === "Guest") {
                vm.action.loginGuest();
            } else {
                vm.action.loginBYOD();
            }
        };

        function rememberMe() {
            if (vm.rememberMe) {
                localStorageService.set("username", vm.username);
                localStorageService.set("password", vm.password);
                localStorageService.set("rememberMe", vm.rememberMe);
            } else {
                localStorageService.remove("username");
                localStorageService.remove("password");
                localStorageService.remove("rememberMe");
            }
        }

        vm.action.loginGuest = function () {
            //guest login
            var addurl = location.href;
            var backurl = "";
            if (addurl.indexOf("backurl") > 0) {
                backurl = getQueryString("backurl");
            } else {
                backurl = $window.location.search;
            }
            var guestcheck = true;
            var username = vm.username;
            if (username == "" || username == undefined || username == null) {
                username = "";
                guestcheck = false;
            }
            var password = vm.password;
            if (password == "" || password == undefined || password == null) {
                password = "";
                guestcheck = false;
            }
            var serviveLevel = vm.level;
            if (typeof (serviveLevel) == "undefined") {
                serviveLevel = null;
            }
            var mac = getQueryString("mac");
            if (typeof (mac) == "undefined") {
                mac = "";
                guestcheck = false;
            } else if (mac == "" || mac == null) {
                guestcheck = false;
            }
            var userIp = getQueryString("ip");
            if (typeof (userIp) == "undefined") {
                userIp = "";
            }
            var url = getQueryString("url");
            if (typeof (url) == "undefined") {
                url = "";
            }
            var data = {
                username: username,
                password: password,
                userIp: userIp,
                strategyName: strategyInfo,
                useFor: "Guest",
                serviceLevel: serviveLevel,
                mac: mac,
                url: url
            };
            if (guestcheck == true) {
                $http({
                    url: "/portal/api/ham/login/auth",
                    method: "POST",
                    data: data
                }).then(function (response) {
                    if (response.data.errorCode == 0) {
                        vm.action.toSuccessPage(data, backurl, response)();
                    } else if (response.data.errorMessage == "upam.alreadyPermissionAccessnetwork") {
                        vm.block = false;
                        reqCount > 0 ? vm.action.toSuccessPage(data, backurl, response)() : vm.action.openDialog(true, response.data.errorMessage, false, vm.action.toSuccessPage(data, backurl, response));
                    } else if (response.data.errorMessage == "upam.DataQuotaIsZero") {
                        vm.action.openDialog(true, response.data.errorMessage, false, vm.action.navigateToSpecifyUrl(vm.dataQuotaUrl));
                    } else {
                        vm.block = false;
                        vm.action.openDialog(true, $translate.instant(response.data.errorMessage));
                    }
                }, function (resp) {
                    reqCount++;
                    if (reqCount > 3) {
                        vm.block = false;
                        vm.action.openDialog(true, $translate.instant("upam.confirmMsg.innerError"), true);
                        reqCount = 0;
                    } else {
                        $timeout(vm.action.loginGuest, 2000);
                    }
                });
            } else if (guestcheck == false) {
                vm.block = false;
                vm.action.openDialog(true, "upam.confirmMsg.verifyInformation");
            }
        };
        //取值的方法
        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = $window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }

        //下线按钮触发的方法
        vm.action.logout = function () {
            vm.block = true;
            var social = localStorageService.get('_login_provider');
            switch (social) {
                case "google":
                    vm.action.logoutGoogle();
                    break;
                case "facebook":
                    vm.action.logoutFB();
                    break;
                case "rainbow":
                    var client = new jso.JSO({
                        providerID: "rainbow"
                    });
                    client.wipeTokens();
                    vm.action.logout2();
                    break;
                default:
                    vm.action.logout2();
            }
        };
        //下线按钮触发的方法
        vm.action.logout2 = function () {
            var parm1 = getQueryString("mac");
            var parm2 = getQueryString("username");
            var parm3 = getQueryString("useFor");
            var addurlzhi = getQueryString("backurl") || localStorageService.get("backurl") ;
            var data = {userMac: parm1, username: parm2, useFor: parm3};
            localStorageService.remove('_login_provider');
            $http({
                url: "/portal/api/ham/logoff/do",
                method: "POST",
                data: data
            }).then(function (resp) {
                if (resp.data.errorCode == 0) {
                    $window.location.href = "login.html" + addurlzhi;
                } else {
                    vm.action.openDialog(true, resp.data.errorMessage);
                }
            }, function (resp) {
                reqCount++;
                if (reqCount > 3) {
                    vm.block = false;
                    $window.location.href = "login.html?" + addurlzhi;
                    reqCount = 0;
                } else {
                    $timeout(vm.action.logout, 2000);
                }
            });
        };
        /*terms & Condition*/
        vm.action.loginBuildIn = function () {
            vm.block = true;
            var username = "BuiltInAccount";
            var addurl = $window.location.href;
            var backurl = "";
            if (addurl.indexOf("backurl") > 0) {
                backurl = getQueryString("backurl");
            } else {
                backurl = $window.location.search;
            }
            var buildcheck = true;
            var serviveLevel = vm.level || "";

            var mac = getQueryString("mac");
            if (typeof (mac) == "undefined") {
                mac = "";
                buildcheck = false;
            } else if (mac == "" || mac == null) {
                buildcheck = false;
            }

            var userIp = getQueryString("ip");
            if (typeof (userIp) == "undefined") {
                userIp = "";
            }
            var url = getQueryString("url");
            if (typeof (url) == "undefined") {
                url = "";
            }
            var data = {
                userIp: userIp,
                strategyName: strategyInfo,
                useFor: "Guest",
                serviceLevel: serviveLevel,
                mac: mac,
                url: url,
                username: username,
				loginCustomAttrList: $scope.loginCustomAttrList
            };
            if (buildcheck == true) {
                $http({
                    url: "/portal/api/ham/login/buildin",
                    method: "POST",
                    data: data
                }).then(
                    function (response) {
                        if (response.data.errorCode == 0) {
                            vm.action.toSuccessPage(data, backurl, response)();
                        }
                        else if (response.data.errorMessage == "upam.alreadyPermissionAccessnetwork") {
                            vm.block = false;
                            reqCount > 0 ? vm.action.toSuccessPage(data, backurl, response)() : vm.action.openDialog(true, response.data.errorMessage, false, vm.action.toSuccessPage(data, backurl, response));
                        } else {
                            vm.block = false;
                            vm.action.openDialog(true, $translate.instant(response.data.errorMessage));
                        }
                    }, function (resp) {
                        reqCount++;
                        if (reqCount > 3) {
                            vm.block = false;
                            vm.action.openDialog(true, $translate.instant("upam.confirmMsg.innerError"), true);
                            reqCount = 0;
                        } else {
                            $timeout(vm.action.loginBuildIn, 2000);
                        }
                    }
                );

            } else if (buildcheck == false) {
                vm.block = false;
                vm.action.openDialog(true, "upam.confirmMsg.verifyInformation");
            }
        };
        vm.action.loginBYOD = function () {
            var byodcheck = true;
            var addurl = $window.location.href;
            var backurl = "";
            if (addurl.indexOf("backurl") > 0) {
                backurl = getQueryString("backurl");
            } else {
                backurl = $window.location.search;
            }
            var username = vm.username;
            if (username == "" || username == undefined || username == null) {
                username = "";
                byodcheck = false;
            }
            var password = vm.password;
            if (password == "" || password == undefined || password == null) {
                password = "";
                byodcheck = false;
            }
            var mac = getQueryString("mac");
            if (typeof (mac) == "undefined") {
                mac = "";
                byodcheck = false;
            } else if (mac == "" || mac == null) {
                byodcheck = false;
            }

            var userIp = getQueryString("ip");
            if (typeof (userIp) == "undefined") {
                userIp = "";
            }
            var url = getQueryString("url");
            if (typeof (url) == "undefined") {
                url = "";
            }
            var data = {
                username: username,
                password: password,
                userIp: userIp,
                strategyName: strategyInfo,
                useFor: "BYOD",
                mac: mac,
                url: url
            };

            if (byodcheck == true) {
                if (!On_Premise_LDAP) {
                    $http({
                        url: "/portal/api/ham/login/auth",
                        method: "POST",
                        data: data
                    }).then(function (response) {
                        if (response.data.errorCode == 0) {
                            vm.action.toSuccessPage(data, backurl, response)();
                        }
                        else if (response.data.errorMessage == "upam.alreadyPermissionAccessnetwork") {
                            vm.block = false;
                            reqCount > 0 ? vm.action.toSuccessPage(data, backurl, response)() : vm.action.openDialog(true, response.data.errorMessage, false, vm.action.toSuccessPage(data, backurl, response));
                        } else {
                            vm.block = false;
                            vm.action.openDialog(true, $translate.instant(response.data.errorMessage));
                        }
                    }, function (resp) {
                        reqCount++;
                        if (reqCount > 3) {
                            vm.block = false;
                            vm.action.openDialog(true, $translate.instant("upam.confirmMsg.innerError"), true);
                            reqCount = 0;
                        } else {
                            $timeout(vm.action.loginBYOD, 2000);
                        }
                    });
                } else {
                    mainService.getLdapAuthForAP({username: username, password: password});
                }
            } else if (byodcheck == false) {
                vm.block = false;
                vm.action.openDialog(true, "upam.confirmMsg.verifyInformation");
            }
        };
        vm.action.accessCode = function () {
            vm.block = true;
            var addurl = $window.location.href;
            var backurl = "";
            if (addurl.indexOf("backurl") > 0) {
                backurl = getQueryString("backurl");
            } else {
                backurl = $window.location.search;
            }
            var guestcheck = true;
            var username = vm.accessCode;
            if (username == "" || username == undefined || username == null) {
                username = "";
                guestcheck = false;
            }
            var password = vm.accessCode;
            if (password == "" || password == undefined || password == null) {
                password = "";
                guestcheck = false;
            }
            var serviveLevel = vm.level;
            if (typeof (serviveLevel) == "undefined") {
                serviveLevel = "";
            }
            var mac = getQueryString("mac");
            if (typeof (mac) == "undefined") {
                mac = "";
                guestcheck = false;
            } else if (mac == "" || mac == null) {
                guestcheck = false;
            }
            var userIp = getQueryString("ip");
            if (typeof (userIp) == "undefined") {
                userIp = "";
            }
            var url = getQueryString("url");
            if (typeof (url) == "undefined") {
                url = "";
            }
            var data = {
                username: username,
                password: password,
                userIp: userIp,
                strategyName: strategyInfo,
                useFor: "Guest",
                serviceLevel: serviveLevel,
                mac: mac,
                url: url
            };
            if (guestcheck == true) {
                $http({
                    url: "/portal/api/ham/login/auth",
                    method: "POST",
                    data: data
                }).then(function (response) {
                    if (response.data.errorCode == 0) {
                        vm.action.toSuccessPage(data, backurl, response)();
                    }
                    else if (response.data.errorMessage == "upam.alreadyPermissionAccessnetwork") {
                        vm.block = false;
                        reqCount > 0 ? vm.action.toSuccessPage(data, backurl, response)() : vm.action.openDialog(true, response.data.errorMessage, false, vm.action.toSuccessPage(data, backurl, response));
                    } else {
                        vm.block = false;
                        vm.action.openDialog(true, $translate.instant(response.data.errorMessage));
                    }
                }, function (resp) {
                    reqCount++;
                    if (reqCount > 3) {
                        vm.block = false;
                        vm.action.openDialog(true, $translate.instant("upam.confirmMsg.innerError"), true);
                        reqCount = 0;
                    } else {
                        $timeout(vm.action.accessCode, 2000);
                    }
                });
            } else if (guestcheck == false) {
                vm.block = false;
                vm.action.openDialog(true, response.data.errorMessage);
            }
        }

        vm.action.toSuccessPage = function (data, backurl, response) {
            return function () {
                if (response.data.data !== null) {
                    $window.location.href = "success.html?mac=" + data.mac + "&username=" + data.username + "&useFor=" + data.useFor + "&backurl=" + backurl + "&fixandinit=" + response.data.data;
                }
                else {
                    $window.location.href = "success.html?mac=" + data.mac + "&username=" + data.username + "&useFor=" + data.useFor + "&backurl=" + backurl;
                }
            }
        };

        vm.action.navigateToSpecifyUrl = function (url) {
           return function () {
               if (url) {
                    $window.location.href = dataQuotaUrl;
               }
           }
        };

        vm.action.logoutFB = function () {
            var fbApiV = 'v11.0';
            var d = document, fbJs, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            fbJs = d.createElement('script');
            fbJs.id = id;
            fbJs.async = true;
            fbJs.src = "https://connect.facebook.net/en_US/sdk.js";
            fbJs.onload = function () {
                FB.init({
                    appId: facebookID,
                    status: true,
                    cookie: true,
                    xfbml: true,
                    version: fbApiV,
                    scope: 'email'
                });
                FB.getLoginStatus(function (response) {
                    if (response.status === "connected") {
                        FB.api("/me/permissions", "delete", vm.action.logout2);
                    }
                }, true);
            };
            ref.parentNode.insertBefore(fbJs, ref);
        };

        vm.action.logoutGoogle = function () {
            var img = new Image();
            img.onload = img.onerror = function () {
                vm.action.logout2();
                $window.localStorage.removeItem('_login_provider');
            };
            img.src = "https://mail.google.com/mail/u/0/?logout&hl=en";
        };
        vm.action.goServicePortalPage = function () {
            window.open(vm.portalServiceUrl);
        };

		$scope.updateAttrList = function(index, attr) {
			if ($scope.timer) {
				$timeout.cancel($scope.timer);
			}
			$scope.timer = $timeout(function(){
				$scope.loginCustomAttrList[index].value = attr.value;
			}, 600);
		};
        vm.action.getOS = function() {
            var platform = $window.navigator.platform;
            var useragent = $window.navigator.userAgent;
            var pcPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K','Win32', 'Win64', 'Windows', 'WinCE'];
            var an =  /Android/.test(useragent);
            var lin =  /Linux/.test(platform);
            return pcPlatforms.indexOf(platform) !== -1 || (!an && lin);
        }
    });
