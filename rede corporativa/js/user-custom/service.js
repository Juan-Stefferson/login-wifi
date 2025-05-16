/**
 * Created by chenqk on 2018/6/6.
 */

angular.module('main')
    .factory('mainService', mainService);

mainService.$inject = ['$http','$q','$window'];

function mainService($http,$q,$window) {

    var service = {
        getLdapAuthForAP:getLdapAuthForAP,
        applyWeChatAuth:applyWeChatAuth,
        checkAuthStatus:checkAuthStatus,
        setLogoBackground: setLogoBackground,
        setBgStyle: setBgStyle
    };
    function getLdapAuthForAP(data){
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", "https://cportal.al-enterprise.com/cgi-bin/ldap_auth.cgi");
        form.setAttribute("target", "_self");
        var name = document.createElement("input");
        name.setAttribute("type", "hidden");
        name.setAttribute("name", "username");
        name.setAttribute("value", data.username);
        var password = document.createElement("input");
        password.setAttribute("type", "hidden");
        password.setAttribute("name", "password");
        password.setAttribute("value", data.password);
        form.appendChild(name);
        form.appendChild(password);
        document.body.appendChild(form);
        $window.open('', '_self');
        form.submit();
    }
    function applyWeChatAuth(){
        var deferred = $q.defer();
        $http({
            url: "https://cportal.al-enterprise.com/cgi-bin/wp_wechat_login.cgi",
            method: "GET",
            /*   data:  $httpParamSerializerJQLike(data),*/
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} // Note the appropriate header
        }).then(function success(response) {
                deferred.resolve(response.data);
            }, function fail(resp) {
                deferred.reject(resp);
            }
        );
        return deferred.promise;
    }
    function checkAuthStatus(extend){
        var deferred = $q.defer();
        $http({
            url: "/portal/api/ham/login/wechat/confirm",
            method: "GET",
            params: {state:$window.btoa(extend)}
            // Note the appropriate header
        }).then(function success(response) {
                deferred.resolve(response.data);
            }, function fail(resp) {
                deferred.reject(resp);
            }
        );
        return deferred.promise;
    }

    /**Set Logo's background color */
    function setLogoBackground(logoBgColor) {
        var logoBgStyle = null;
        if (!logoBgColor) {
            logoBgStyle = {
                "background-image": "linear-gradient(to bottom right, #152849,#3E6B82, #2359B9, #457BD3)"
            };
        } else {
            logoBgStyle = {
                "background-color": logoBgColor
            };
        }
        return logoBgStyle;
    }

    /**
     * Background color and Opacity
     */
    function setBgStyle(colorValue, imgUrl, repeatValue) {
        var backgroundStyle = {};
        if (colorValue) {
            backgroundStyle["background-color"] = colorValue;
        }
        if (imgUrl) {
            backgroundStyle["background-image"] = "url(" + imgUrl + ")";
            if (repeatValue) {
                backgroundStyle["background-repeat"] = repeatValue;
            }
        }

        return backgroundStyle;
    }

    return service;
}
