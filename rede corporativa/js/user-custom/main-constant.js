/**
 * Created by chenqk on 2018/6/6.
 */


    angular.module('main')
        .constant('mainConstant', {
            countryFlagCss : "flag-icon flag-icon-",
            defaultCountryFlagCss:"flag-icon flag-icon-world",
            requireRule:{
                validator:function(model){
                    return  model === "";
                },
                error: 'login.errorMessage.requireRule'
            },
            nameRule: {
                    validator: function (model) {
                        var reg = /^[-A-Za-z0-9.:_/@]*$/;
                        return model == null ? false :!reg.exec(model);
                    },
                    error: 'login.errorMessage.usernmaeRule'
                },
            fieldLength32:{
                validator: function (model) {
                    var reg = /^.{1,32}$/;
                    return model == null ? false : !reg.test(model);
                 },
                error: 'login.errorMessage.fieldLength32'
            },
            fieldLength16:{
                validator: function (model) {
                    if(model && (model.length > 16 || model.length < 6)){
                        return true;
                     }
                        return false;
                 },
                error: 'login.errorMessage.fieldLength16'
            },
            noAscII:{
                validator: function (model) {
                    var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
                    var regfu = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
                    if (reg.test(model) || regfu.test(model)) {
                        return true;
                    }
                },
                error: 'login.errorMessage.no-ASCII'
            },
            specificSymbol: {
                validator: function (model) {
                    if (model && !(model.indexOf('/') === -1
                        && model.indexOf('\\') === -1
                        && model.indexOf('=') === -1
                        && model.indexOf('#') === -1
                        && model.indexOf(';') === -1
                        && model.indexOf('+') === -1
                        && model.indexOf('@') === -1
                        && model.indexOf('*') === -1
                        && model.indexOf('?') === -1
                        && model.indexOf(',') === -1
                        && model.indexOf('<') === -1
                        && model.indexOf('>') === -1
                        && model.indexOf('"') === -1
                        && model.indexOf('\'') === -1
                        && model.indexOf('{') === -1
                        && model.indexOf('}') === -1)) {
                        return true;
                    }
                    return false;
                },
                error: 'login.errorMessage.specificSymbol'
            },
            fieldLength128:{
                validator: function (model) {
                    if(model && (model.length > 128 || model.length < 1)){
                        return true;
                    }
                    return false;
                },
                error: 'login.errorMessage.fieldLength128'
            },
            fieldLength64:{
                validator: function (model) {
                    if(model && (model.length > 64 || model.length < 1)){
                        return true;
                    }
                    return false;
                },
                error: 'login.errorMessage.fieldLength64'
            },
			fieldLength255: {
            	validator: function(model) {
            		if (model && (model.length > 255 || model.length < 1)) {
            			return true;
					}
					return false;
				},
				error: 'login.errorMessage.fieldLength255'
			}
        });
