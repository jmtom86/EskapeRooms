    var myApp = angular.module('myApp', ['ngRoute']);
    //  use the config method to set up routing:
    myApp.config(function ($routeProvider) {
      $routeProvider
        .when('/',{
            templateUrl: 'partials/login.html'
        })
        .when('/timer',{
            templateUrl: 'partials/timer.html'
        })
        .when('/timera',{
            templateUrl: 'partials/timera.html'
        })
        .when('/timerods',{
            templateUrl: 'partials/timerods.html'
        })
        .when('/timeraods',{
            templateUrl: 'partials/timeraods.html'
        })
        .otherwise({
          redirectTo: '/'
        });
    });
