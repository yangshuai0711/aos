angular.module('aos').filter('timeAgoFilter', function($filter) {
	return function (time, fullTime) {
		if (fullTime) {
			return $filter('timestampFilter')(time);
		}
		return aosJS.utils.format.timeAgo(time);
	}
});
