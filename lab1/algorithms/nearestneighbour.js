var promise = require('promise');
var _ = require('lodash');

module.exports = function(startCityIndex, cities, distances) {
	return new Promise(function(resolve, reject) {
		var route = { path: [], totalDistance: 0 };
		var startCity = cities[startCityIndex];
		var citiesLeft = _.cloneDeep(cities);
		route.path.push(startCity.name);
		_.remove(citiesLeft, function(city) { return city.name === startCity.name });

		findShortestRouteByNearestNeighbour(route, citiesLeft, distances)
		.then(function() {
			resolve(route);
		});
	});
};

var findShortestRouteByNearestNeighbour = function(route, citiesLeft, distances) {
	return new Promise(function(resolve, reject) {
		if(citiesLeft.length > 0) {
			var lastCityName = route.path[route.path.length - 1];
			var shortestDistance = getShortestDistance(lastCityName, citiesLeft, distances);
			var currentCityName = (shortestDistance.city1 === lastCityName) ? shortestDistance.city2 : shortestDistance.city1;
			route.totalDistance += shortestDistance.distance;
			route.path.push(currentCityName);
			_.remove(citiesLeft, function(city) { return city.name === currentCityName });

			findShortestRouteByNearestNeighbour(route, citiesLeft, distances)
			.then(function() {
				resolve();
			});
		} else {
			route.totalDistance += getDistance(route.path[route.path.length - 1], route.path[0], distances);
			route.path.push(route.path[0]);
			resolve();
		}
	});
};

var getShortestDistance = function(cityName, citiesLeft, distances) {
	var result = _.filter(distances, function(distance) { 
		return (distance.city1 === cityName) && (_.find(citiesLeft, function(city) {
			return city.name === distance.city2;
		}));
	});
	result = _.concat(result, _.filter(distances, function(distance) { 
		return (distance.city2 === cityName) && (_.find(citiesLeft, function(city) {
			return city.name === distance.city1;
		})); 
	}));
	console.log(result);
	return _.minBy(result, 'distance');
};

var getDistance = function(city1, city2, distances) {
	var result = _.find(distances, {city1: city1, city2: city2});
	if(result) {
		return result.distance;
	} else {
		return _.find(distances, {city1: city2, city2: city1}).distance;
	}
};