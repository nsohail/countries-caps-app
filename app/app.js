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
app.factory('getCountryList', ['$http', '$q', 'main_link', 'countries_path', 'username', function($http, $q, main_link, countries_path, username) {
  var g = {
    getCountries: function() {

      var deferred = $q.defer();

        var req = $http({
          url : main_link + countries_path,
          method: 'GET',
          cache: true,
          params: {
            //callback: 'JSON_CALLBACK',
            username: username
          }
        });

        req.success(function(data){
          deferred.resolve(data.geonames);
        });

      return deferred.promise; //this returns the functions promise
    
    }

  };

  return g; //this returns the object in the factory AKA the factory

}]);


app.factory('getCountryInfo', ['$rootScope', function($rootScope){
  return function getCountryInfo(chosenCode) {

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
app.controller('countriesCtrl', ['getCountryList', '$scope', '$rootScope', '$location', function(getCountryList, $rootScope, $scope, $location){
  
  $rootScope.countryData = getCountryList.getCountries();

  console.log($rootScope.countryData);

  $scope.countryDetail = function(chosenCode){
    $location.path('/' + 'countries' + '/' + chosenCode); ///countries/:country'
  };

}]);


app.controller('detailCtrl', ['$rootScope', '$route', 'getCountryInfo', 'getNeighbors', 'getCountryCapInfo', function($rootScope, $route, getCountryInfo, getNeighbors, getCountryCapInfo){

  $rootScope.countryCode = $route.current.params.country;  ///countries/:country'

  getCountryInfo($rootScope.countryCode);
  getCountryCapInfo($rootScope.countryCode);
  getNeighbors($rootScope.countryCode);


}]);

