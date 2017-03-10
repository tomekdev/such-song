angular.module('app')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/song', {
                controller: 'SongCtrl',
                templateUrl: '/views/song.html'
            })
    })
