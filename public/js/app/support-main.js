angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider.when('/access', {
        templateUrl: 'views/access.html',
        controller: 'ssAccessCtrl'
    }).when('/complete', {
        templateUrl: 'views/complete.html',
        controller: 'ssAccessCtrl'
    }).otherwise({ redirectTo: '/access'});

});


