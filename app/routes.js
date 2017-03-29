angular.module('app')
.config(function($routeProvider){
        $routeProvider
            .when('/', {
//                controller: 'LoginCtrl',
//                templateUrl: '/views/login.html'
            })
            .when('/login', {
                controller: 'LoginCtrl',
                templateUrl: '/views/login.html'
            })
            .when('/register', {
                controller: 'RegisterCtrl',
                templateUrl: '/views/register.html'
            })
            .when('/song', {
                controller: 'SongCtrl',
                templateUrl: '/views/song.html'
            })
            .otherwise({
                redirectTo: '/ijhokl'
            });
    }).run(function(UserSvc, $rootScope, $location){

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        if (!UserSvc.currentUser) {
            $location.path("/login")
        }
    });

});