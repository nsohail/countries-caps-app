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
	})
  .when('/countries/:country', {
    templateUrl : 'views/country.html',
    controller : 'detailCtrl'
  });

}]);



//services here
app.factory('getCountryList', ['$http', 'main_link', 'countries_path', 'username', '$rootScope', function($http, main_link, countries_path, username, $rootScope) {
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
      $rootScope.countryData = data.geonames;
      console.log($rootScope.countryData);
    });

    function getCountryInfo(countryName) {
      for(var x in $rootScope.countryData) {
        if(x.countryCode == countryName) {
          console.log(x);
        }
      }
    }
  };

}]);





//controllers here
app.controller('countriesCtrl', ['getCountryList', '$scope', '$location', function(getCountryList, $scope, $location){
  getCountryList();

  $scope.countryDetail = function(countryCode){
    $location.path('/' + 'countries' + '/' + countryCode); ///countries/:country'
  };

}]);


app.controller('detailCtrl', ['$scope', '$route', 'getCountryList', function($scope, $route, getCountryList){
  var countryCode = $route.current.params.country;
  console.log(countryCode);

  getCountryInfo();

}]);

