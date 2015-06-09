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
    });

  };

}]);


app.factory('getCountryInfo', ['$rootScope', function($rootScope){
  return function getCountryInfo(chosenCode) {
    console.log('info working');
    console.log($rootScope.countryData);

    for(var x in $rootScope.countryData) {
      var eachObject = $rootScope.countryData[x];
      
      if(eachObject.countryCode == chosenCode) {
        $rootScope.countryInfo = eachObject;
        $rootScope.countryCode = eachObject.countryCode;
        $rootScope.capital = eachObject.capital;
      }

    }
  };

}]);



app.factory('getCountryCapInfo',['$rootScope', '$http', 'username', 'main_link', 'countries_path', function($rootScope,$http, username, main_link, countries_path){
  return function getCountryCapInfo(countryCode){
    var request = {
      q: $rootScope.capital,
      country: countryCode,
      fcode:'pplc',
      username:username
    };

    return $http({
      url : main_link + 'searchJSON',
      method: 'GET',
      cache: true,
      params: request
    })
    .success(function(result){
      var object = result.geonames;
      $rootScope.capPop = object[0].population;
    });
  };
}]);


app.factory('getNeighbors', ['$http', 'username', '$rootScope', 'main_link', function($http, username, $rootScope, main_link){
  return function getNeighbors(countryCode){
    console.log('neighbor working');
    return $http({
      url : main_link + 'neighboursJSON?',
      method: 'GET',
      cache: true,
      params: {
        country: countryCode,
        username: username
      }
    })
    .success(function(result){
      $rootScope.neighborObjects = result.geonames;

      if($rootScope.neighborObjects.length) {

        $rootScope.numNeighbors = $rootScope.neighborObjects.length;
        
      }
      
    });
  };
}]);





//controllers here
app.controller('countriesCtrl', ['getCountryList', '$scope', '$location', function(getCountryList, $scope, $location){
  getCountryList();

  $scope.countryDetail = function(chosenCode){
    $location.path('/' + 'countries' + '/' + chosenCode); ///countries/:country'
  };

}]);


app.controller('detailCtrl', ['$scope', '$route', 'getCountryInfo', 'getNeighbors', 'getCountryCapInfo', function($scope, $route, getCountryInfo, getNeighbors, getCountryCapInfo){
  var countryCode = $route.current.params.country;  ///countries/:country'

  console.log(countryCode);

  getCountryInfo(countryCode);
  getCountryCapInfo(countryCode);
  getNeighbors(countryCode);

}]);

