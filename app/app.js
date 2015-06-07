var app = angular.module('cacApp', ['ngRoute']);

app.constant('main_link', 'http://api.geonames.org/');
app.constant('countries_path', 'countryInfoJSON');
app.constant('username', 'nsohail92');


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



//services here
app.factory('getCountryList', ['$http', 'main_link', 'countries_path', 'username', function($http, main_link, countries_path, username) {
  return function(){
    return $http({
      url : main_link + countries_path,
      method: 'GET',
      cache: true,
      params: {
        //callback: 'JSON_CALLBACK',
        username: username
      }
    })
    .success(function(data){
      console.log(data.geonames);
    });
  };

}]);


//controllers here
app.controller('countriesCtrl', ['$scope', function($scope){

}]);
  


