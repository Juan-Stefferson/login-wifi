/**
 * Created by chenqk on 2018/6/6.
 */

angular.module('main', [
    "ui.bootstrap",
    "pascalprecht.translate",
    "LocalStorageModule"
])
.config(['$translateProvider', function ($translateProvider) {
    //international json file path  in nugix
    $translateProvider.useStaticFilesLoader({
        prefix: 'language/',
        suffix: '.json'
    });
}])
    .directive("validator",function($q){
        return {
            restrict: "A",
           require:"ngModel",
            scope:{
                validator:"="
            },
            link: function(scope, elm, attrs,ctrl) {
                  ctrl.$asyncValidators.invalid =  function (value){
                    var deferred = $q.defer();
                      var state = _.find(scope.validator, function (item) {
                          if(item.validator(value)){
                              return true;
                          }else{
                              return false;
                          }
                      });
                      if(state){
                          ctrl.$error.errMessage = state.error;
                          deferred.reject();
                      }else{
                          ctrl.$error = {};
                          deferred.resolve()
                      }
                      return deferred.promise;
                  }
            }
        };

    });