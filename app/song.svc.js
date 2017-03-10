angular.module('app')
    .service('SongSvc', function ($http) {
        this.fetchAll = function () {
            return $http.get('/api/songs')
                .then(function (response) {
                    return response.data
                })
        }
        this.fetchOne = function (iSongId) {
            return $http.get('/api/song/' + iSongId, {
                    cache: true
                })
                .then(function (response) {
                    return response.data
                })
        }
        this.add = function (song) {
            return $http.post('/api/songs/', song)
                .then(function (response) {
                    return response.data
                })
        }
    })
