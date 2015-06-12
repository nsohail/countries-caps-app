var app = angular.module('cacApp', ['ngRoute', 'ngAnimate']);

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
  })
  .otherwise({
    templateUrl : 'views/home.html'
  });

}]);

app.run(function($rootScope, $location, $timeout){

  $rootScope.$on('$routeChangeStart', function(){
    if($location.path() == '/'){
       $rootScope.isLoading = false;
       console.log('/');
    } else{
      $rootScope.isLoading = true;
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(){
    if($location.path() == '/'){
      $rootScope.isLoading = false;
    }
    else {
      $timeout(function(){
        $rootScope.isLoading = false;
      },1000); 
    }
  });

});


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
          //console.log(deferred);
          deferred.resolve(data.geonames);
        });

      return deferred.promise; //this returns the functions promise
    
    }

  };

  return g; //this returns the object in the factory AKA the factory

}]);


app.factory('getCountryInfo', ['$http', '$q', 'getCountryList', 'countries_path', function($http, $q, getCountryList, countries_path){
  return function getCountryInfo(chosenCode) {
    console.log(chosenCode);
    var deferred = $q.defer();

      var req = $http({
        url : 'http://api.geonames.org/' + countries_path,
        method: 'GET',
        cache: true,
        params: {
          //callback: 'JSON_CALLBACK',
          country: chosenCode,
          username: "nsohail92"
        }
      });
      req.success(function(data){
        deferred.resolve(data.geonames);
      });

    return deferred.promise;
    
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
  
  getCountryList.getCountries()
  .then(function(data){
    getCountryList.countryData = data;
    $scope.countries = getCountryList.countryData;
  });


  $scope.countryDetail = function(chosenCode){
    $location.path('/' + 'countries' + '/' + chosenCode); ///countries/:country'
  };

}]);


app.controller('detailCtrl', ['$scope', '$route', 'getCountryInfo', 'getNeighbors', 'getCountryCapInfo', function($scope, $route, getCountryInfo, getNeighbors, getCountryCapInfo){

  var countryCode = $route.current.params.country;  ///countries/:country'

  //getCountryInfo(countryCode);
  getCountryCapInfo(countryCode);
  getNeighbors(countryCode);

  getCountryInfo(countryCode)
  .then(function(data){
    getCountryInfo.countryDetail = data;
    var countryInfo = getCountryInfo.countryDetail;

    for(var m in countryInfo) {
      $scope.countryPop = countryInfo[m].population;
      $scope.countryArea = countryInfo[m].areaInSqKm;
      $scope.countryCap = countryInfo[m].capital;
    }
    
    console.log(countryInfo);
  });


}]);

