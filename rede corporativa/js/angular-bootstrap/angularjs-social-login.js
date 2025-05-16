angular.module('main')
    .factory('socialLoginService', socialLoginService);

      socialLoginService.$inject = ['$window', '$rootScope','$q','$http','$translate','localStorageService'];
 function socialLoginService ($window, $rootScope,$q,$http,$translate,localStorageService){

	return {
		logout: function(){
			var provider = localStorageService.get('_login_provider');
			switch(provider) {
				case "google":
					//its a hack need to find better solution.
					var gElement = document.getElementById("gSignout");
					if (typeof(gElement) != 'undefined' && gElement != null)
					{
					  gElement.remove();
					}
					var d = document, gSignout, ref = d.getElementsByTagName('script')[0];
					gSignout = d.createElement('script');
					gSignout.src = "https://accounts.google.com/Logout";
					gSignout.type = "text/html";
					gSignout.id = "gSignout";
                    localStorageService.remove('_login_provider');
					$rootScope.$broadcast('event:social-sign-out-success', "success");
					ref.parentNode.insertBefore(gSignout, ref);
			        break;
				case "facebook":
					FB.logout(function(res){
                        localStorageService.remove('_login_provider');
					 	$rootScope.$broadcast('event:social-sign-out-success', "success");
					});
					break;
			}
		},
		setProvider: function(provider){
            localStorageService.set('_login_provider', provider);
		},
        initFB:function(fbKey,vm,$scope){
            var  fbApiV = 'v11.0';
            var d = document, fbJs, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            fbJs = d.createElement('script');
            fbJs.id = id;
            fbJs.async = true;
            fbJs.src = "https://connect.facebook.net/en_US/sdk.js";
            fbJs.onload = function() {
                FB.init({
                    appId: fbKey,
                    status: true,
                    cookie: true,
                    xfbml: true,
                    version: fbApiV
                });

                FB.AppEvents.logPageView();
                var login = function(msg){
                    var redirect = 'https://www.facebook.com/v11.0/dialog/oauth?client_id='+facebookID+'&redirect_uri='+encodeURIComponent($window.location.href.split('?')[0]) + '&response_type=token';
                    $window.location.href = redirect;
                };
                FB.getLoginStatus(function(response) {
                    if(response.status === "connected"){
                            testAPI();
                        //    socialLoginService.setProvider("facebook");
                    }else{
                        login();
                    }
                }, true);
                //取值的方法
                function getQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                    var r = $window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };

               function testAPI(){
                   FB.api('/me', function(response) {
                       var mac = localStorageService.get('mac');
                       var url = localStorageService.get('url');
                       var serviveLevel = parseInt(localStorageService.get('serviveLevel'));
                       var backurl = localStorageService.get('backurl');
                       var data = {
                           username: response.id,
                           strategyName: strategyInfo,
                           useFor: "Guest",
                           serviceLevel: serviveLevel,
                           mac: mac,
                           url: url
                       };
                           $http({
                               url: "/portal/api/ham/login/socialAccount",
                               method: "POST",
                               data: data
                           }).then(function(response){
                               if (response.data.errorCode == 0) {
                                   localStorageService.set('_login_provider', "facebook");
                                   if (response.data.data !== null) {
                                       $window.location.href = "success.html?mac="+data.mac+"&username="+data.username+"&useFor="+data.useFor+"&backurl="+backurl+"&fixandinit="+response.data.data;
		}
                                   else {
                                       $window.location.href = "success.html?mac="+data.mac+"&username="+data.username+"&useFor="+data.useFor+"&backurl="+backurl;
                                   }
                               }
                               else {
                                   vm.action.openDialog(true,response.data.errorMessage,vm,$scope);
                                   vm.modalInstance.result.then(function(){
                                   $window.location.href = localStorageService.get('loginUrl');
                                   });
	}
                           },function(response){
                               vm.action.openDialog(true,$translate.instant("upam.confirmMsg.innerError") +" :"+ response.status);
                               vm.modalInstance.result.then(function(){
                               $window.location.href = localStorageService.get('loginUrl');
                               });
                           })

                   });
			   }
            };
            ref.parentNode.insertBefore(fbJs, ref);
        },
		initGoogle:function(id,vm,$scope){
		    var GoogleAuth;
            var d = document, gJs, ref = d.getElementsByTagName('script')[0];
            gJs = d.createElement('script');
            gJs.async = true;
            gJs.src = "https://apis.google.com/js/platform.js";
            var postSocial = function(data,backurl){
                $http({
                    url: "/portal/api/ham/login/socialAccount",
                    method: "POST",
                    data: data
                }).then(function(response){
                    if (response.data.errorCode == 0) {
                        localStorageService.set('_login_provider', "google");
                        if (response.data.data !== null) {
                            $window.location.href = "success.html?mac="+data.mac+"&username="+data.username+"&useFor="+data.useFor+"&backurl="+backurl+"&fixandinit="+response.data.data;
                        }
                        else {
                            $window.location.href = "success.html?mac="+data.mac+"&username="+data.username+"&useFor="+data.useFor+"&backurl="+backurl;
                        }
                    }
                    else {
                        vm.action.openDialog(true,response.data.errorMessage);
                        vm.modalInstance.result.then(function(){
                        $window.location.href = localStorageService.get('loginUrl');
                        });
                    }
                },function(resp){
                    vm.action.openDialog(true,$translate.instant("upam.confirmMsg.innerError") +" :"+ resp.status);
                    vm.modalInstance.result.then(function(){
                    $window.location.href = localStorageService.get('loginUrl');
                    });
                })
            };
            gJs.onload = function() {
               var  redirectURI = $window.location.href;
                var params ={
                    client_id: id,
                    scope: 'email',
                    ux_mode:'redirect',
                    redirect_uri:redirectURI
                };
                gapi.load('auth2', function() {
                    GoogleAuth =  gapi.auth2.init(params).then(function(){
                        if(typeof(GoogleAuth.gauth) == "undefined"){
                            GoogleAuth.gauth = gapi.auth2.getAuthInstance();
                        }
                        if(!GoogleAuth.gauth.isSignedIn.get()){
                            GoogleAuth.gauth.signIn().then(function(googleUser){
                                var profile = googleUser.getBasicProfile();
                                var mac = localStorageService.get('mac');
                                var url = localStorageService.get('url');
                                var serviveLevel = parseInt(localStorageService.get('serviveLevel'));
                                var backurl = localStorageService.get('backurl');
                                var data = {
                                    username:profile.getId(),
                                    strategyName : strategyInfo,
                                    useFor : "Guest",
                                    serviceLevel : serviveLevel,
                                    mac : mac,
                                    url : url
                                };
                                //   socialLoginService.setProvider("google");
                                //   $rootScope.$broadcast('event:social-sign-in-success', fetchUserDetails());
                                postSocial(data,backurl);
                            }, function(err){
                                vm.action.openDialog(true,err);
                                vm.modalInstance.result.then(function(){
                                    $window.location.href = localStorageService.get('loginUrl');
                                });
				    });
                        }else{
                            var currentUser = GoogleAuth.gauth.currentUser.get();
                            var profile = currentUser.getBasicProfile();
                            var mac = localStorageService.get('mac');
                            var url = localStorageService.get('url');
                            var serviveLevel = parseInt(localStorageService.get('serviveLevel'));
                            var backurl = localStorageService.get('backurl');
                            var data = {
                                username:profile.getId(),
                                strategyName : strategyInfo,
                                useFor : "Guest",
                                serviceLevel : serviveLevel,
                                mac : mac,
                                url : url
                            };
                            //   socialLoginService.setProvider("google");
                            //   $rootScope.$broadcast('event:social-sign-in-success', fetchUserDetails());
                            postSocial(data,backurl);
                            //  socialLoginService.setProvider("google");
                            // $rootScope.$broadcast('event:social-sign-in-success', fetchUserDetails());
                        }
				});
                });
            };
            ref.parentNode.insertBefore(gJs, ref);
		}
	}
                };