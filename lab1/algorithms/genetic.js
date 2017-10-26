var promise = require('promise');
var _ = require('lodash');

const POPULATION_SIZE = 4;

module.exports = function(startCityIndex, cities, distances) {

	var population = [];
	var startCity = cities[startCityIndex];

	for(var i = 0; i < POPULATION_SIZE; i++) {
		var citiesLeft = _.cloneDeep(cities);
		_.remove(citiesLeft, function(element) { return element.name === startCity.name; });
		population.push(generateRandomSolution(startCity, citiesLeft, distances));
	};

	evaluatePopulation(population);
	population = _.sortBy(population, [(element) => { return element.totalDistance; }]);
	var newPopulation = selection(population);

	console.log('Population:');
	console.log(population);
	console.log('New population:');
	console.log(newPopulation);

	edgeCrossover(newPopulation[0], newPopulation[1]);
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
	population = _.sortBy(population, [(element) => { return element.evaluation; }]);

	var temp;
	var i = 0, j = population.length - 1;
	while(i !== j && i < j) {
		temp = population[i].evaluation;
		population[i].evaluation = population[j].evaluation;
		population[j].evaluation = temp;
		i++;
		j--;
	};
};

var selection = function(population) {
	for(var i = 0; i < population.length; i++) {
		if(i === 0) {
			population[i].a = 0;
			population[i].b = Math.round(population[i].evaluation);
		} else if(i === (population.length - 1)) {
			population[i].a = population[i - 1].b + 1;
			population[i].b = 100;	
		} else {
			population[i].a = population[i - 1].b + 1;
			population[i].b = population[i - 1].b + Math.round(population[i].evaluation);
		}
	}
	var random, newPopulation = [];
	for(var i = 0; i < population.length; i++) {
		random = generateInt(0, 100);
		console.log(random);
		newPopulation.push(_.find(population, (element) => { return (element.a <= random) && (random <= element.b); }));
	}
	return newPopulation;
};

var edgeCrossover = function(parent1, parent2, distances) {
	var neighbourList;
	var children = {};
	var parents = [parent1, parent2];
	var edgesList = {};

	console.log(parent1.path);
	console.log(parent2.path);

	parents.forEach((parent) => {
		for(var i = 0; i < parent.path.length; i++) {
			if(edgesList[parent.path[i]] !== undefined) {
				neighbourList = edgesList[parent.path[i]];
			} else {
				neighbourList = [];
			}

			if((parent.path[i - 1] !== undefined) && !_.includes(neighbourList, parent.path[i - 1])) {
				neighbourList.push(parent.path[i - 1]);
			}
			if((parent.path[i + 1] !== undefined) && !_.includes(neighbourList, parent.path[i + 1])) {
				neighbourList.push(parent.path[i + 1]);
			}
			edgesList[parent.path[i]] = _.cloneDeep(neighbourList);
		}
	});
	
	children.path = [];
	children.path.push(parent1.path[0]);
	_.map(edgesList, (value) => {
		_.remove(value, (element) => {
			return element === parent1.path[0];
		});
		return value;
	});
	console.log(children);
	console.log(edgesList);
	while(children.path.length !== parent1.path.length) {
		var nextCity;
		var currentCityEdges = edgesList[children[children.length - 1]];

		if(currentCityEdges.length > 1) {

		} else {
			nextCity = currentCityEdges[0];
		}
		_.forEach(, (value) => {

		});
	}
};

var mutation = function(chromosome) {
	
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