/**
 * Created by chenqk on 2018/6/6.
 */

angular.module('main')
    .factory('mainActionService', mainService);
mainService.$inject = ['localStorageService', 'mainConstant', '$translate', '$http', '$window', '$interval', '$uibModal'];

function mainService(localStorageService, mainConstant, $translate, $http, $window, $interval, $uibModal) {

    var service = {
        decorator: decorator
    };

    return service;

    function decorator(vm, $scope) {
        vm.action = {};
        vm.action.rules = {
            username: [
                mainConstant.fieldLength128,
                mainConstant.nameRule,
                mainConstant.noAscII,
                mainConstant.requireRule
            ],
            password: [
                mainConstant.noAscII,
                mainConstant.requireRule
            ],
            accessCode: [
                mainConstant.requireRule,
                {
                    validator: function (model) {
                        var reg = /^[-A-Za-z0-9.:_/@]*$/;
                        return !reg.exec(model);
                    },
                    error: 'login.errorMessage.usernmaeRule'
                }
            ],
            guestName: [
                mainConstant.nameRule,
                mainConstant.fieldLength32,
                mainConstant.noAscII,
                mainConstant.requireRule
            ],
            emailAddress: [
                mainConstant.requireRule,
                mainConstant.fieldLength64,
                mainConstant.noAscII,
                {
                    validator: function (model) {
                        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return model && !re.test(String(model).toLowerCase());
                    },
                    error: 'login.errorMessage.emailRule'
                }
            ],
            phoneNumber: [
                mainConstant.requireRule,
                {
                    validator: function (model) {
                        var telr = "^((\\+\\d{1,3}(-| )?\\(?\\d\\)?(-| )?\\d{1,5})|(\\(?\\d{2,6}\\)?))(-| )?(\\d{3,4})(-| )?(\\d{4})(( x| ext)\\d{1,5}){0,1}$";
                        return model && !model.match(telr);
                    },
                    error: 'login.errorMessage.phoneNumber'
                }
            ],
            guestPassword: [
                mainConstant.requireRule,
                mainConstant.noAscII,
                {
                    validator: function (model) {
                        var telr = new RegExp(/^.{6,16}$/);
                        return model && !telr.test(model);
                    },
                    error: 'login.errorMessage.passwordLength16'
                }
            ],
            fullName: [
                mainConstant.noAscII,
                mainConstant.requireRule,
                mainConstant.fieldLength32,
            ],
            company: [
                mainConstant.requireRule,
                mainConstant.noAscII,
                mainConstant.specificSymbol,
                mainConstant.fieldLength32
            ],
            country: [
                mainConstant.requireRule,
                mainConstant.noAscII,
                mainConstant.fieldLength32,
                mainConstant.specificSymbol
            ],
            department: [
                mainConstant.requireRule,
                mainConstant.noAscII,
                mainConstant.fieldLength32,
                mainConstant.specificSymbol
            ],
            employeeVisited: [
                mainConstant.requireRule,
                mainConstant.noAscII,
                mainConstant.fieldLength32,
                mainConstant.specificSymbol
            ],
            employeeEmail: [
                mainConstant.requireRule,
                {
                    validator: function (model) {
                        var employeeEmail = model + vm.selectEmployEmail;
                        var emailr = "^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$";
                        if (model && !employeeEmail.match(emailr)) {
                            return true;
                        }
                        return false;
                    },
                    error: 'login.errorMessage.emailRule'
                },
                {
                    validator: function (model) {
                        var employeeEmail = model + vm.selectEmployEmail;
                        if (employeeEmail.length < 4 || employeeEmail.length > 64) {
                            return true;
                        }
                    },
                    error: 'login.errorMessage.emailLength'
                }
            ],
            position: [
                mainConstant.requireRule,
                mainConstant.noAscII,
                mainConstant.fieldLength32,
                mainConstant.specificSymbol
            ],
            purposeOfTheVisited: [
                mainConstant.requireRule,
                mainConstant.noAscII,
                mainConstant.specificSymbol,
                mainConstant.fieldLength128
            ],
            verifyCode: [
                mainConstant.requireRule
            ],
            guestConfirmPassword: [
                {
                    validator: function (model) {
                        return model && vm.guestpassword && vm.guestpassword !== model;
                    },
                    error: 'register.errorMessage.confirmPasswordNotMatch'
                }
            ],
			customAttr: [
				mainConstant.fieldLength255,
				mainConstant.requireRule
            ],
            newPasswd: [
                mainConstant.requireRule,
                mainConstant.noAscII,
                {
                    validator: function (model) {
                        var telr = new RegExp(/^.{6,16}$/);
                        return model && !telr.test(model);
                    },
                    error: 'login.errorMessage.passwordLength16'
                }
            ],
            confirmPasswd: [
                mainConstant.requireRule,
                mainConstant.noAscII,
                {
                    validator: function (model) {
                        return model && vm.newPasswd && model !== vm.newPasswd;
                    },
                    error: 'register.errorMessage.confirmPasswordNotMatch'
                }
                
            ]
        };
        vm.action.initLocalLanguage = function () {
// 1. languages -> Array of preferred languages (eg ["en-US", "zh-CN", "ja-JP"]) Firefox^32, Chrome^32
// 2. language  -> Preferred language as String (eg "en-US") Firefox^5, IE^11, Safari,
//                 Chrome sends Browser UI language
// 3. browserLanguage -> UI Language of IE
// 4. userLanguage    -> Language of Windows Regional Options
// 5. systemLanguage  -> UI Language of Windows
            var browserLanguagePropertyKeys = ['languages', 'language', 'browserLanguage', 'userLanguage', 'systemLanguage'];

            var availableLanguages = ['en', 'zh', 'de', 'fi', 'fr', 'nl', 'no', 'nb', 'nn', 'es', 'ko', 'pl', 'pt', 'it', 'sv', 'tr','ro'];

            var detectedLocale = _.chain(window.navigator)
                .pick(browserLanguagePropertyKeys) //Get only language properties
                .values() //Get values of the properties
                .flatten() //flatten all arrays
                .compact() //Remove undefined values
                .map(function (x) {
                    return x.substr(0, 2); //Shorten strings to use two chars (en-US -> en)
                })
                .find(function (x) {
                    return _.contains(availableLanguages, x); //Returns first language matched in available languages
                })
                .value();

            var locale = detectedLocale || 'en'; //If no locale is detected, fallback to 'en'
            // (ko,kr)   (no,nb,nn)  (es,)  (pt===br) (sv===se)
            var localLanguage = localStorageService.get('languageIcon') || getCountryByLanguage(locale);
            if (localLanguage) {
                vm.languageIcon = mainConstant.countryFlagCss + localLanguage;
				if (localLanguage == 'us') {
					vm.languageIcon = mainConstant.countryFlagCss + 'world';
				}
            } else {
                vm.languageIcon = mainConstant.defaultCountryFlagCss;
            }
            $translate.use(localLanguage);
        };

        function getCountryByLanguage(language) {
            var cc = language;
            switch (language) {
                case 'no':
                case 'nb':
                case 'nn':
                    cc = 'no';
                    break;
                case 'pt':
                    cc = 'br';
                    break;
                case 'ko':
                    cc = 'kr';
                    break;
                case 'sv':
                    cc = 'se';
                    break;
                case 'zh':
                    cc = 'cn';
                    break;
                case 'en':
                    cc = 'us';
                    break;
            }
            return cc;
        }

        vm.action.switching = function (langKey) {
            $translate.use(langKey);
			vm.languageIcon = mainConstant.countryFlagCss + langKey;
			if (langKey == 'us') {
				vm.languageIcon = mainConstant.countryFlagCss + 'world';
			}
            localStorageService.set('languageIcon', langKey);
        };
        var clear = null;

        function refresh(token) {
            $http({
                url: "/portal/api/ham/userRegistration/backToFront",
                method: "POST",
                data: {token: token}
            })
                .then(function success(resp) {
                    var responseJson = resp.data;
                    if (responseJson.errorCode == 0) {
                        vm.markedWord = responseJson.data.message;
                        vm.accountStatus = responseJson.data.status;
                        vm.password = responseJson.data.password;
                        vm.dateOfEffective = responseJson.data.dateOfEffective;
                        vm.expireTime = responseJson.data.expireTime;
                        vm.username = responseJson.data.username;
                        vm.email = responseJson.data.emailID;
                        vm.telephone = responseJson.data.phoneNumber;
                        vm.company = responseJson.data.company;
                        vm.fullName = responseJson.data.fullName;
                        vm.reasonVisited = responseJson.data.reasonVisited;
                        vm.employeeEmail = responseJson.data.employeeEmailID;
                        vm.position = responseJson.data.position;
                        vm.department = responseJson.data.department;
                        vm.countryOrRegion = responseJson.data.countryOrRegion;
                        vm.employeeVisited = responseJson.data.employeeVisited;
                        vm.employeePhoneNumber = responseJson.data.employeePhoneNumber;
                        vm.description = responseJson.data.description;
                        var token = responseJson.data.token;
                        if (token) {
                            vm.enableBackLogin = false;
                        } else {
                            $interval.cancel(clear);
                            vm.enableBackLogin = true;
                        }
                    } else {
                        vm.action.openDialog(true, responseJson.errorMessage);
                        vm.enableBackLogin = true;
                    }
                })
        };

        vm.action.register = function () {
            vm.disRegistration = true;
            var matchResult = true;
            var emailr = "^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$";
            var telr = "^((\\+\\d{1,3}(-| )?\\(?\\d\\)?(-| )?\\d{1,5})|(\\(?\\d{2,6}\\)?))(-| )?(\\d{3,4})(-| )?(\\d{4})(( x| ext)\\d{1,5}){0,1}$";
            var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
            var regfu = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
            var testuser = new RegExp("[A-Za-z0-9.:\\-_/@]*");

            var username = vm.username;
            if ((username != undefined) && (reg.test(username) || regfu.test(username) || (!(username.match(testuser) == username)) || username.length > 32 || username.length < 1)) {
                username = null;
                matchResult = false;
            }

            var password = vm.guestpassword;
            if ((password != undefined) && (reg.test(password) || regfu.test(password) || password.length < 6 || password.length > 16)) {
                password = null;
                matchResult = false;
            }
            var telephone = vm.telephone;
            if ((telephone != undefined) && (!telephone.match(telr) || reg.test(telephone) || regfu.test(telephone))) {
                telephone = null;
                matchResult = false;
            }

            var email = vm.email;

            if ((email != undefined) && (reg.test(email) || regfu.test(email) || email.length < 4 || email.length > 64 || !email.match(emailr))) {
                email = null;
                matchResult = false;
            }

            var company = vm.company;
            if ((company != undefined) && (reg.test(company) || regfu.test(company) || company.length > 32 || company.length < 1 || !(company.indexOf('/') === -1 && company.indexOf('\\') === -1 && company.indexOf('=') === -1 && company.indexOf('#') === -1 && company.indexOf(';') === -1 && company.indexOf('+') === -1 && company.indexOf('@') === -1 && company.indexOf('*') === -1 && company.indexOf('?') === -1 && company.indexOf(',') === -1 && company.indexOf('<') === -1 && company.indexOf('>') === -1 && company.indexOf('"') === -1 && company.indexOf('\'') === -1 && company.indexOf('{') === -1 && company.indexOf('}') === -1))) {
                company = null;
                matchResult = false;
            }

            var fullName = vm.fullname;
            if ((fullName != undefined) && (reg.test(fullName) || regfu.test(fullName) || fullName.length < 1 || fullName.length > 32)) {
                fullName = null;
                matchResult = false;
            }

            var visitReason = vm.reasonVisited;
            if ((visitReason != undefined) && (reg.test(visitReason) || regfu.test(visitReason) || visitReason.length > 128 || visitReason.length < 1 || !(visitReason.indexOf('/') === -1 && visitReason.indexOf('\\') === -1 && visitReason.indexOf('=') === -1 && visitReason.indexOf('#') === -1 && visitReason.indexOf(';') === -1 && visitReason.indexOf('+') === -1 && visitReason.indexOf('@') === -1 && visitReason.indexOf('*') === -1 && visitReason.indexOf('?') === -1 && visitReason.indexOf(',') === -1 && visitReason.indexOf('<') === -1 && visitReason.indexOf('>') === -1 && visitReason.indexOf('"') === -1 && visitReason.indexOf('\'') === -1 && visitReason.indexOf('{') === -1 && visitReason.indexOf('}') === -1))) {
                visitReason = null;
                matchResult = false;
            }

            var employeeEmailID = vm.employeeEmailID;
            if (vm.emailRestriction == "Suffix") {
                employeeEmailID = employeeEmailID + vm.selectEmployEmail;
            }

            var position = vm.position;
            if ((position != undefined) && (reg.test(position) || regfu.test(position) || position.length > 32 || position.length < 1 || !(position.indexOf('/') === -1 && position.indexOf('\\') === -1 && position.indexOf('=') === -1 && position.indexOf('#') === -1 && position.indexOf(';') === -1 && position.indexOf('+') === -1 && position.indexOf('@') === -1 && position.indexOf('*') === -1 && position.indexOf('?') === -1 && position.indexOf(',') === -1 && position.indexOf('<') === -1 && position.indexOf('>') === -1 && position.indexOf('"') === -1 && position.indexOf('\'') === -1 && position.indexOf('{') === -1 && position.indexOf('}') === -1))) {
                position = null;
                matchResult = false;
            }

            var department = vm.department;
            if ((department != undefined) && (reg.test(department) || regfu.test(department) || department.length > 32 || department.length < 1 || !(department.indexOf('/') === -1 && department.indexOf('\\') === -1 && department.indexOf('=') === -1 && department.indexOf('#') === -1 && department.indexOf(';') === -1 && department.indexOf('+') === -1 && department.indexOf('@') === -1 && department.indexOf('*') === -1 && department.indexOf('?') === -1 && department.indexOf(',') === -1 && department.indexOf('<') === -1 && department.indexOf('>') === -1 && department.indexOf('"') === -1 && department.indexOf('\'') === -1 && department.indexOf('{') === -1 && department.indexOf('}') === -1))) {
                department = null;
                matchResult = false;
            }

            var countryOrRegion = vm.country;
            if ((countryOrRegion != undefined) && (reg.test(countryOrRegion) || regfu.test(countryOrRegion) || countryOrRegion.length > 32 || countryOrRegion.length < 1 || !(countryOrRegion.indexOf('/') === -1 && countryOrRegion.indexOf('\\') === -1 && countryOrRegion.indexOf('=') === -1 && countryOrRegion.indexOf('#') === -1 && countryOrRegion.indexOf(';') === -1 && countryOrRegion.indexOf('+') === -1 && countryOrRegion.indexOf('@') === -1 && countryOrRegion.indexOf('*') === -1 && countryOrRegion.indexOf('?') === -1 && countryOrRegion.indexOf(',') === -1 && countryOrRegion.indexOf('<') === -1 && countryOrRegion.indexOf('>') === -1 && countryOrRegion.indexOf('"') === -1 && countryOrRegion.indexOf('\'') === -1 && countryOrRegion.indexOf('{') === -1 && countryOrRegion.indexOf('}') === -1))) {
                countryOrRegion = null;
                matchResult = false;
            }

            var employeeVisited = vm.employeeVisited;
            if ((employeeVisited != undefined) && (reg.test(employeeVisited) || regfu.test(employeeVisited) || employeeVisited.length > 32 || employeeVisited.length < 1 || !(employeeVisited.indexOf('/') === -1 && employeeVisited.indexOf('\\') === -1 && employeeVisited.indexOf('=') === -1 && employeeVisited.indexOf('#') === -1 && employeeVisited.indexOf(';') === -1 && employeeVisited.indexOf('+') === -1 && employeeVisited.indexOf('@') === -1 && employeeVisited.indexOf('*') === -1 && employeeVisited.indexOf('?') === -1 && employeeVisited.indexOf(',') === -1 && employeeVisited.indexOf('<') === -1 && employeeVisited.indexOf('>') === -1 && employeeVisited.indexOf('"') === -1 && employeeVisited.indexOf('\'') === -1 && employeeVisited.indexOf('{') === -1 && employeeVisited.indexOf('}') === -1))) {
                employeeVisited = null;
                matchResult = false;
            }

            var employeePhoneNumber = vm.employeePhoneNumber;
            if ((employeePhoneNumber != undefined) && (!(employeePhoneNumber.match(telr)) || reg.test(employeePhoneNumber) || regfu.test(employeePhoneNumber))) {
                employeePhoneNumber = null;
                matchResult = false;
            }

            var data = {
                username: username,
                password: password,
                emailID: email,
                phoneNumber: telephone,
                company: company,
                fullName: fullName,
                reasonVisited: visitReason,
                employeeEmailID: employeeEmailID,
                position: position,
                department: department,
                countryOrRegion: countryOrRegion,
                employeeVisited: employeeVisited,
                employeePhoneNumber: employeePhoneNumber,
                registrationStrategy: strategyInfo,
                verifyCode: vm.verifyCode,
                location: vm.location,
				selfRegisterCustomAttrList:  $scope.selfRegisterCustomAttrList,
                languageRegistration:$translate.use()
            };
            if (!matchResult == false) {
                $http({
                    url: "/portal/api/ham/userRegistration/addAccount",
                    method: "POST",
                    data: data
                }).then(function (resp) {
                        vm.disRegistration = false;
                        var response = resp.data;
                        if (response.errorCode == 0) {
                            vm.showRegistered = true;
                            vm.action.openDialog(false, "upam.confirmMsg.registerSuccess");
                            var token = response.data.token;
                            vm.accountStatus = response.data.status;
                            vm.markedWord = response.data.message;
                            vm.password = response.data.password;
                            vm.dateOfEffective = response.data.dateOfEffective;
                            vm.expireTime = response.data.expireTime;
                            vm.username = response.data.username;
                            vm.email = response.data.emailID;
                            vm.telephone = response.data.phoneNumber;
                            vm.company = response.data.company;
                            vm.fullName = response.data.fullName;
                            vm.reasonVisited = response.data.reasonVisited;
                            vm.employeeEmailID = response.data.employeeEmailID;
                            vm.position = response.data.position;
                            vm.department = response.data.department;
                            vm.countryOrRegion = response.data.countryOrRegion;
                            vm.employeeVisited = response.data.employeeVisited;
                            vm.employeePhoneNumber = response.data.employeePhoneNumber;
                            vm.description = response.data.description;
                            if (token) {
                                clear = $interval(function () {
                                    refresh(token)
                                }, 10000);
                                vm.enableBackLogin = false;
                            } else {
                                vm.enableBackLogin = true;
                            }
                        } else {
                            vm.action.openDialog(true, response.errorMessage);
                            vm.enableBackLogin = true;
                        }
                    },
                    function (resp) {
                        vm.disRegistration = false;
                        vm.action.openDialog(true, $translate.instant("upam.confirmMsg.innerError"));
                        vm.enableBackLogin = true;
                    });
            } else {
                vm.disRegistration = false;
                vm.action.openDialog(true, "upam.confirmMsg.verifyInformation");
            }
        };
        vm.action.initLocalLanguage();
        vm.action.autoComplete = function () {
            vm.username = localStorageService.get("username");
            vm.password = localStorageService.get("password");
            vm.rememberMe = !!localStorageService.get("rememberMe");
        };

        vm.action.getCurrentLevel = function () {
            localStorageService.set("level", vm.level);
        };

        vm.action.toSocialLoginHtml = function (pageName) {
            var backurl = $window.location.search;
            var mac = getQueryString("mac");
            if (typeof (mac) == "undefined") {
                mac = "";
            }
            var url = getQueryString("url");
            if (typeof (url) == "undefined") {
                url = "";
            }
            localStorageService.set('mac', mac);
            localStorageService.set('url', url);
            localStorageService.set('backurl', backurl);
            localStorageService.set('loginUrl', $window.location.href);
            $window.location = pageName;
        };

        vm.action.email = function (value) {
            vm.selectEmployEmail = value;
        };

        vm.action.backToLogin = function () {
            $window.history.back();
        };
        vm.modalInstance = null;
        vm.action.openDialog = function (isError, message, isCacheErr, closedFunc) {
            vm.error = isError;
            vm.response = message;
            if (isCacheErr) {
                vm.modalInstance = $uibModal.open({
                    template: '<div class="panel panel-danger" style="margin-bottom:0px;" ng-if="vm.error">\n' +
                        '    <div class="panel-body" style="color: #a94442; background-color: #f2dede">\n' +
                        '        {{vm.response | translate}}\n' +
                        '    </div>\n' +
                        '    <div class="panel-footer" style="text-align: right;">\n' +
                        '        <a class="btn btn-danger btn" ng-click="vm.action.closeDialog()">{{\'upam.confirmMsg.okBtn\' | translate}}</a>\n' +
                        '    </div>\n' +
                        '</div>',
                    backdrop: 'static',
                    keyboard: 'false',
                    scope: $scope
                });
            } else {
                vm.modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    /*     controller : "loginController",*/
                    backdrop: 'static',
                    keyboard: 'false',
                    scope: $scope
                });
            }
            vm.modalInstance.result.then(closedFunc);
        };

        vm.action.closeDialog = function () {
            vm.modalInstance.close();
        };

        vm.action.validateForm = function (form) {
            for (var i in form) {
                if (i[0] !== '$' && (!form[i].$viewValue || form[i].$invalid)) {
                    return true;
                }
            }
        };
        vm.action.getVerifyCode = function () {
            vm.action.codeTimeout = 120;
            vm.verifyCodeStatus = true;
            getVerifyCode();
            var verifyCode = $interval(function () {
                if (vm.action.codeTimeout === 0) {
                    $interval.cancel(verifyCode);
                } else {
                    vm.action.codeTimeout--;
                }
            }, 1000);
        };

        function getVerifyCode() {
            $http({
                url: "/portal/api/ham/userRegistration/getVerifyCode",
                method: "POST",
                data: {
                    username: vm.username,
                    emailID: vm.email,
                    phoneNumber: vm.telephone,
                    languageRegistration:$translate.use()
                }
            })
                .then(function success(resp) {
                    var responseJson = resp.data;
                    if (responseJson.errorCode === -1) {
                        vm.verifyCodeStatus = false;
                        vm.action.openDialog(true, responseJson.errorMessage);
                    }
                })
        }

        //go to logo link url
        vm.action.welcomeLinkedUrl = function () {
            function openWelcome() {
                var tempWindow = $window.open('_blank');
                tempWindow.location = "" + vm.welcomeLinkedURL;
            }

            vm.welcomeLinkedURL ? openWelcome() : "";
        };
        //go to logo link url
        vm.action.successLinkedUrl = function () {
            function openSuccess() {
                var tempWindow = $window.open('_blank');
                tempWindow.location = "" + vm.successLinkedURL;
            }

            vm.successLinkedURL ? openSuccess() : "";
        };

        //取值的方法
        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = $window.location.search.substr(1).match(reg);
            if (r != null) {
                var decodedStr = unescape(r[2]);
                //If there are control characters in string, replace to ""
                decodedStr = decodedStr.replace(/\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007|\u0008|\u0009|\u000a|\u000b|\u000c|\u000d|\u000e|\u000f|\u0010|\u0011|\u0012|\u0013|\u0014|\u0015|\u0016|\u0017|\u0018|\u0019|\u001a|\u001b|\u001c|\u001d|\u001e|\u001f|\u007F/g, '');
                return decodedStr;
            }
            return null;
        }

        function checkResult(){
            var jsonString = getQueryString("errorMessage");
            if (jsonString) {
                vm.action.openDialog(true,jsonString);
            }
        }

        vm.action.postToBYOD = function () {
            var jsonString = getQueryString("portalData");
            if (!jsonString) {
                return false;
            }
            var addurl = $window.location.href;
            var backurl = "";
            if (addurl.indexOf("backurl") > 0) {
                backurl = getQueryString("backurl");
            } else {
                backurl = $window.location.search;
            }
            var jsonData = JSON.parse(jsonString);
            var data = {
                username: jsonData.userName,
                userIp: getQueryString("ip"),
                strategyName: strategyInfo,
                useFor: "BYOD",
                mac: getQueryString("mac"),
                url: getQueryString("url"),
                errorCode: jsonData.errorCode,
                result: jsonData.result,
                attributes: jsonData.data
            };
            $http({
                url: "/portal/api/ham/login/auth",
                method: "POST",
                data: data
            }).then(function (response) {
                if (response.data.errorCode == 0) {
                    if (response.data.data !== null) {
                        $window.location.href = "success.html?mac=" + data.mac + "&username=" + data.username + "&useFor=" + data.useFor + "&backurl=" + backurl.split('&portalData')[0] + "&fixandinit=" + response.data.data;
                    } else {
                        $window.location.href = "success.html?mac=" + data.mac + "&username=" + data.username + "&useFor=" + data.useFor + "&backurl=" + backurl.split('&portalData')[0];
                    }
                } else {
                    vm.block = false;
                    vm.action.openDialog(true, response.data.errorMessage);
                }
            }, function (resp) {
                vm.block = false;
                vm.action.openDialog(true, $translate.instant("upam.confirmMsg.innerError") + " :" + resp.status);
            });
        };
        vm.action.validConfirmPassword = function (form) {
            form["guestConfirmPassword"].$validate();
        };

        /**
         * Manually validate a field dynamically
         */
        vm.action.validFormItem = function (form, itemName) {
            form[itemName].$validate();
        };

        /**
         * Navigate to resetpassword.html to reset password
         */
        vm.action.goToResetPasswd = function () {
            $window.location.href = "resetpassword.html";
        };

        vm.action.postToBYOD();
        vm.action.autoComplete();
        checkResult();
    }

}