var promise = require('promise');
var _ = require('lodash');

var possibleRoutes = [];

module.exports = function(startCityIndex, cities, distances) {
	return new Promise(function(resolve, reject) {
		var route = { path: [], totalDistance: 0 };
		var startCity = cities[startCityIndex];
		var citiesLeft = _.cloneDeep(cities);
		route.path.push(startCity.name);
		_.remove(citiesLeft, function(element) { return element.name === startCity.name; });

		findAllPossibilities(route, citiesLeft, distances)
		.then(function() {
			resolve(_.minBy(possibleRoutes, 'totalDistance'));
		});
	});
};

var findAllPossibilities = function(route, citiesLeft, distances) {
	return new Promise(function(resolve, reject) {
		var routeNext;
		var citiesLeftNext;
		if(citiesLeft.length > 0) {
			citiesLeft.forEach(function(currentCity) {
				routeNext = _.cloneDeep(route);
				citiesLeftNext = _.cloneDeep(citiesLeft);
				routeNext.totalDistance += getDistance(routeNext.path[routeNext.path.length - 1], currentCity.name, distances);
				routeNext.path.push(currentCity.name);
				_.remove(citiesLeftNext, function(element) { return element.name === currentCity.name; });

				findAllPossibilities(routeNext, citiesLeftNext, distances)
				.then(function() {
					resolve();
				});
			});
		} else {
			route.totalDistance += getDistance(route.path[route.path.length - 1], route.path[0], distances);
			route.path.push(route.path[0]);
			possibleRoutes.push(route);
			resolve();
		}
	});
};

var getDistance = function(city1, city2, distances) {
	var result = _.find(distances, {city1: city1, city2: city2});
	if(result) {
		return result.distance;
	} else {
		return _.find(distances, {city1: city2, city2: city1}).distance;
	}
};