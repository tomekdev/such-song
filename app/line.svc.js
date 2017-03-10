angular.module('app')
    .service('LineSvc', function ($http, $cacheFactory) {
        this.add = function (iSongId, line) {
            $cacheFactory.get('$http').remove('/api/song/' + iSongId);
            return $http.post('/api/song/' + iSongId + '/lines', line)
                .then(function (response) {
                    return response.data
                })
        };
        this.update = function (iSongId, line) {
            $cacheFactory.get('$http').remove('/api/song/' + iSongId);
            return $http.put('/api/song/' + iSongId + '/line/' + line._id, line)
                .then(function (response) {
                    return response.data
                })
        };
        this.delete = function (iSongId, line) {
            $cacheFactory.get('$http').remove('/api/song/' + iSongId);
            return $http.delete('/api/song/' + iSongId + '/line/' + line._id)
                .then(function (response) {
                    return response.data
                })
        }
    })
