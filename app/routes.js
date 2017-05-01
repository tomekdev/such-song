angular.module('app')
.config(function($routeProvider){
        $routeProvider
            .when('/', {
//                controller: 'LoginCtrl',
//                templateUrl: '/views/login.html'
            })
            .when('/login', {
                templateUrl: '/views/login.html'
            })
            .when('/register', {
                controller: 'RegisterCtrl',
                templateUrl: '/views/register.html'
            })
            .when('/song', {
                templateUrl: '/views/song.html'
            })
            .when('/groups', {
                templateUrl: '/views/groups.html'
            })
            .otherwise({
                redirectTo: '/error404'
            });
    }).run(function(UserSvc, $rootScope, $location){

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        if (!UserSvc.currentUser && !localStorage.getItem("token")) {
            $location.path("/login")
        }
    });

});