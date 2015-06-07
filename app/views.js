var app = angular.module('cacApp', ['ngRoute','cacAppServices']);

	app.config(['$routeProvider', function($routeProvider){
		$routeProvider
		.when('/', {
			templateUrl : 'views/home.html'
		})
		.when('/countries', {
			templateUrl : 'views/countries.html',
			controller : 'countriesCtrl'
		});
	}]);

	app.controller('countriesCtrl', ['$scope', 'getCountryList', function($scope, getCountryList){
		getCountries();
	}]);

	