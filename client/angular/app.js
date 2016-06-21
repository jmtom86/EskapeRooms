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
        .otherwise({
          redirectTo: '/'
        });
    });
