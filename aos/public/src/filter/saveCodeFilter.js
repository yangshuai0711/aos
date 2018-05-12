angular.module('aos').filter('saveCodeFilter', function ($rootScope) {
    return function (key) {

        if( $rootScope.coedobj[key]){
            // console.log(key)
            return true;
        } else {
            return false;

        }
    }
});
