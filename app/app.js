var app = angular.module('cacApp', ['ngRoute']);

app.constant('main_link', 'http://api.geonames.org/');
app.constant('countries_path', 'countryInfoJSON');
app.constant('username', 'iris_qu');


//routes here
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


//controllers here
app.controller('countriesCtrl', ['$scope', 'getCountryList', function($scope, getCountryList){
	getCountries();
}]);



//services here
app.factory('getCountryList', ['$http', 'main_link', 'countries_path', function($http, main_link, countries_path) {
  var getCountries = {
    getCountries: function() {

      $http({
        url : main_link + countries_path,
        method: 'GET',
        cache: true,
        params: {
          callback: 'JSON_CALLBACK',
          username: username
        }
      })

      .success(function(data){
        console.log(data);
      })
      .error(function(){
        console.log("This error occured " + error);
      });

    }
  };

  return getCountries;

}]);