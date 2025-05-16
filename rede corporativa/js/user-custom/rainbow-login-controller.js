angular.module('main')
    .controller("rainbowLoginController",function ($scope, $translate, $http,mainActionService,$window,localStorageService, mainService) {
        var vm = this;
        vm.welcome_logo = welcome_logo;
        var mac = localStorageService.get('mac');
        var portalURL = localStorageService.get('url');
        var backurl = localStorageService.get('backurl');
        var logoBg = typeof(welcomeLogoBgColor) === "undefined" ? null : welcomeLogoBgColor;
        vm.welcomeBgColor = (typeof (welcomeBgColor) === "undefined" || !welcomeBgColor) ? "rgb(255, 250, 253, 0.9)" : welcomeBgColor;
        vm.welcomeBgSrc = (typeof (welcome_bg_src) === "undefined" || !welcome_bg_src) ? "img/bg-default.jpg" : welcome_bg_src;

        $scope.logoBg = mainService.setLogoBackground(logoBg);
        $scope.welcomeBgColorStyle = mainService.setBgStyle(vm.welcomeBgColor);
        $scope.welcomeBgStyle = mainService.setBgStyle(null, vm.welcomeBgSrc, 'no-repeat');

        mainActionService.decorator(vm,$scope);

        var client = new jso.JSO({
            providerID: "rainbow",
            client_id: aleRainbowOAuthClientID,
            redirect_uri: $window.location.href, // The URL where you is redirected back, and where you perform run the callback() function.
            authorization: "https://openrainbow.com/api/rainbow/authentication/v1.0/oauth/authorize",
            scopes: {request:['all']},
            response_type: 'token'
        });
        client.callback();
        client.getToken()
            .then(function(){
                var f = new jso.Fetcher(client);
                var url = 'https://openrainbow.com/api/rainbow/enduser/v1.0/users/me';
                f.fetch(url, {})
                    .then(function(resp) {
                        return resp.json();
                    })
                    .then(function(resp){
                        var data = {
                            username: resp.data.id,
                            strategyName: strategyInfo,
                            useFor: "Guest",
                            mac: mac,
                            url: portalURL
                        };
                        $http({
                            url: "/portal/api/ham/login/socialAccount",
                            method: "POST",
                            data: data
                        }).then(function(response){
                            if (response.data.errorCode == 0) {
                                localStorageService.set('_login_provider', "rainbow");
                                if(response.data.data) {
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
                        });
                    })
                    .catch(function(err){
                        vm.action.openDialog(true,$translate.instant("upam.confirmMsg.innerError") +" :"+ err.message);
                        vm.modalInstance.result.then(function(){
                            $window.location.href = localStorageService.get('loginUrl');
                        });
                        console.error("Error from fetcher", err)
                    });
            });
    });