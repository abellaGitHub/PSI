var promise = require('promise');
var _ = require('lodash');

const POPULATION_SIZE = 8;

module.exports = function(startCityIndex, cities, distances) {

	var population = [];
	var startCity = cities[startCityIndex];

	for(var i = 0; i < POPULATION_SIZE; i++) {
		var citiesLeft = _.cloneDeep(cities);
		_.remove(citiesLeft, function(element) { return element.name === startCity.name; });
		population.push(generateRandomSolution(startCity, citiesLeft, distances));
	};

	evaluatePopulation(population);

	console.log('Population:');
	console.log(_.sortBy(population, [(element) => { return element.evaluation; }]));
};

var generateRandomSolution = function(startCity, cities, distances) {

	var nextCity;
	var path = [];
	var totalDistance = 0;
	path.push(startCity.name);

	while(cities.length > 0) {
		nextCity = cities[generateInt(0, cities.length - 1)];
		_.remove(cities, (city) => { return city.name === nextCity.name; });
		totalDistance += getDistance(path[path.length - 1], nextCity.name, distances);
		path.push(nextCity.name);
	}

	totalDistance += getDistance(path[path.length - 1], startCity.name, distances);
	path.push(startCity.name);

	return {path: path, totalDistance: totalDistance};
};

var evaluatePopulation = function(population) {

	var evaluationBase = 0;

	_.forEach(population, (element) => { evaluationBase += element.totalDistance; });
	_.forEach(population, (element) => {
		element.evaluation = Math.round((element.totalDistance / evaluationBase) * 10000) / 100;
	});
};

var crossover = function(parent1, parent2) {

};

var mutation = function() {

};

var generateInt = function(from, to) {
	return Math.floor((Math.random() * (to + 1)) + from);
};

var getDistance = function(city1, city2, distances) {
	var result = _.find(distances, {city1: city1, city2: city2});
	if(result) {
		return result.distance;
	} else {
		return _.find(distances, {city1: city2, city2: city1}).distance;
	}
};