/**
 * Created by zenking on 16/6/27.
 */
angular.module('aos').filter('timestampFilter', function($filter) {
    return function (timestamp) {
        return aosJS.utils.format.fullTimestamp(timestamp);
    }
});
