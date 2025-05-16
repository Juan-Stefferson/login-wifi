angular.module('main')
        .controller("weixinLoginController",function ($scope, $translate, $http,mainActionService,$window,localStorageService,$timeout,mainService) {
            var vm = this;
            vm.welcome_logo = welcome_logo;
            var jettyOrigin = $window.location.origin;
            var appId = weChatAppID;
            var timestamp = new Date().getTime();
            var shopId = weChatShopID;
            var authUrl = jettyOrigin +'/portal/api/ham/login/wechat/auth/';
            var pcAuthUrl = jettyOrigin + '/portal/api/ham/login/wechat/pc/auth';
            var ssid = 'HAN-Employee';
            var secretkey = weChatSecrectKey;
            var mac = localStorageService.get("mac");
            var initUrl = localStorageService.get('url');
            var path = $window.location.href;
            var platform = $window.navigator.platform;
            var data = {
                strategyName : strategyInfo,
                useFor : "Guest",
                mac : mac
            };
            var stateData = {
                strategyName : strategyInfo,
                useFor : "Guest",
                mac : mac,
                path: path.substring(0,path.lastIndexOf("/")+1),
                backurl:localStorageService.get("backurl")
            };
            var checkStatus = JSON.stringify({
                strategyName : strategyInfo,
                useFor : "Guest",
                mac : mac,
                initUrl:initUrl
            });
            var  state = $window.btoa(JSON.stringify(stateData));
            var  extend = $window.btoa(JSON.stringify(data));
            var  sign  = $.md5(appId + extend + timestamp + shopId + authUrl + mac + ssid + secretkey);
            var  iosver = iOSversion();
            
            var logoBg = typeof (welcomeLogoBgColor) === "undefined" ? null : welcomeLogoBgColor;
            vm.welcomeBgColor = (typeof (welcomeBgColor) === "undefined" || !welcomeBgColor) ? "rgb(255, 250, 253, 0.9)" : welcomeBgColor;
            vm.welcomeBgSrc = (typeof (welcome_bg_src) === "undefined" || !welcome_bg_src) ? "img/bg-default.jpg" : welcome_bg_src;

            $scope.logoBg = mainService.setLogoBackground(logoBg);
            $scope.welcomeBgColorStyle = mainService.setBgStyle(vm.welcomeBgColor);
            $scope.welcomeBgStyle = mainService.setBgStyle(null, vm.welcomeBgSrc, 'no-repeat');

            mainActionService.decorator(vm,$scope);

            function iOSversion() {
                if (/iP(hone|od|ad)/.test(platform)) {
                    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
                }
            }

            /**
             * 微信连Wi-Fi协议3.1供运营商portal呼起微信浏览器使用
             */

            $window.failFunction = function() {
                mainService.checkAuthStatus(checkStatus).then(function success(resp) {
                    if (resp.errorCode !== -1) {
                        vm.block = false;
                        var rs = resp.data;
                        if(rs.fixandinit){
                            $window.location.href = "success.html?mac=" + data.mac+"&username="+rs.account+"&useFor=Guest&fixandinit="+rs.fixandinit;
                        }else{
                            $window.location.href = "success.html?mac=" + data.mac+"&username="+rs.account+"&useFor=Guest";
                        }
                    }else{
                        vm.action.openDialog(true, $translate.instant(resp.errorMessage));
                        vm.modalInstance.result.then(function(){
                            $window.location.href = localStorageService.get('loginUrl');
                        });
                    }
                });
            };

            $window.jsonpCallbackFail = function(result){
                vm.action.openDialog(true,result.data);
            };
            $window.callWeChat = function(result){
                if(result && result.success){
                    var ua=  $window.navigator.userAgent;
                    if (ua.indexOf("iPhone") != -1 ||ua.indexOf("iPod")!=-1||ua.indexOf("iPad") != -1) {//iPhone
                        var ver = iosver[0];
                        if (ver >= 11 && ver < 12) {
                            var ovj = $window.btoa(JSON.stringify({
                                url:result.data,
                                mac:mac,
                                initUrl:initUrl
                            }));
                            vm.wechaturl = $window.location.href + '?wechatURL='+ ovj;
                            $timeout(function () {
                                checkIfSafari(result);
                            }, 1500);
                        } else {
                            $timeout(function() { $window.location = result.data; }, 2000);
                        }
                    } else {
                        createIframe();
                        callUpTimestamp = new Date().getTime();
                        loadIframe.src = result.data;
                        noResponse = $timeout(function () {
                            failFunction();
                        }, 5000);
                    }
                }else if(result && !result.success){
                    jsonpCallbackFail(result);
                }
            };

            function checkIfSafari(result) {
                 var searchObject = $window.location.search;
                 if (searchObject && searchObject.indexOf("wechatURL")) {
                     var wechatURL =  searchObject.substring(11);
                     var paramas = JSON.parse($window.atob(wechatURL));
                       checkStatus = JSON.stringify({
                           strategyName : strategyInfo,
                           useFor : "Guest",
                           mac:paramas.mac,
                           initUrl:paramas.initUrl
                       });
                       $timeout(function () {
                           failFunction();
                       }, 5000);
                       $window.location =  paramas.url;
                    }else if(result){
                        $timeout(function () {
                            document.getElementById('openSafarisss').click();
                        }, 1000);
                    }else{
                        Wechat_GotoRedirect(appId, extend, timestamp, sign, shopId, authUrl, mac, ssid);
                    }
            }
            function Wechat_GotoRedirect(appId, extend, timestamp, sign, shopId, authUrl, mac, ssid, bssid){
                //将回调函数名称带到服务器端
                var url = "https://wifi.weixin.qq.com/operator/callWechatBrowser.xhtml?appId=" + appId
                    + "&extend=" + extend
                    + "&timestamp=" + timestamp
                    + "&sign=" + sign;

                //如果sign后面的参数有值，则是新3.1发起的流程
                if(authUrl && shopId){
                    url = "https://wifi.weixin.qq.com/operator/callWechat.xhtml?appId=" + appId
                        + "&extend=" + extend
                        + "&timestamp=" + timestamp
                        + "&sign=" + sign
                        + "&shopId=" + shopId
                        + "&authUrl=" + encodeURIComponent(authUrl)
                        + "&mac=" + mac
                        + "&ssid=" + ssid
                        + "&bssid=" + bssid;
                }
                //通过dom操作创建script节点实现异步请求
                var script = document.createElement('script');
                script.setAttribute('src', url);
                document.getElementsByTagName('head')[0].appendChild(script);
            }

            function wechatOAuth(){
                $window.location.href = "https://open.weixin.qq.com/connect/qrconnect?appid="+openAppId+"&redirect_uri="+pcAuthUrl+"&response_type=code&scope=snsapi_login&state="+state+"#wechat_redirect";
            }
            wechatOAuth();
        });
