var bruteforce = require('./algorithms/bruteforce.js');
var nearestneighbour = require('./algorithms/nearestneighbour.js');
var genetic = require('./algorithms/genetic.js');

const MAX_X = 10;
const MAX_Y = 10;
const NUMBER_OF_CITIES = 8;

var cities = [];
var distances = [];
var startCityIndex;

var generateCities = function(numberOfCities) {
	for(var i = 0; i < numberOfCities; i++) {
		var city = generateCity();
		city.name = i + 1;
		cities.push(city);
	};
	console.log('Generated cities:');
	console.log(cities);
};

var generateCity = function() {
	var city;
	do {
		city = {x: generateInt(0, MAX_X), y: generateInt(0, MAX_Y)};
	} while(checkCollision(city));
	return city;
};

var generateInt = function(from, to) {
	return Math.floor((Math.random() * (to + 1)) + from);
};

var checkCollision = function(city) {
	var collision = cities.find(function(element) {
		return element.x === city.x && element.y === city.y;
	});
	return collision;
};

var calculateDistances = function() {
	cities.forEach(function(element, index) {
		for(var i = index + 1; i < cities.length; i++) {
			distances.push({city1: element.name, city2: cities[i].name, distance: calculateDistance(element, cities[i])});
		}
	});
	console.log('Distances:');
	console.log(distances);
};

var calculateDistance = function(city1, city2) {
	return Math.round(Math.sqrt(Math.pow(city1.x - city2.x, 2) + Math.pow(city1.y - city2.y, 2)) * 100) / 100;
};

startCityIndex = generateInt(0, NUMBER_OF_CITIES - 1);

generateCities(NUMBER_OF_CITIES);
calculateDistances();

/*
var bf_start = Date.now();
bruteforce(startCityIndex, cities, distances)
.then(function(shortestRoute) {
	console.log('BruteForce result:');
	console.log(shortestRoute);
	console.log('Execution time: ' + (Date.now() - bf_start) + ' ms');
});


var nn_start = Date.now();
nearestneighbour(startCityIndex, cities, distances)
.then(function(shortestRoute) {
	console.log('NearestNeighbour result:');
	console.log(shortestRoute);
	console.log('Execution time: ' + (Date.now() - nn_start) + ' ms');
});
*/

genetic(startCityIndex, cities, distances);