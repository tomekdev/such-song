angular.module('app')
    .service('LineSvc', function ($http, $cacheFactory) {
        this.add = function (group, iSongId, line) {
            $cacheFactory.get('$http').remove('/api/song/' + iSongId);
            return $http.post('/api/group/'+group._id+'/song/' + iSongId + '/lines', line)
                .then(function (response) {
                    return response.data
                })
        };
        this.update = function (group, iSongId, line) {
            $cacheFactory.get('$http').remove('/api/song/' + iSongId);
            return $http.put('/api/group/'+group._id+'/song/' + iSongId + '/line/' + line._id, line)
                .then(function (response) {
                    return response.data
                })
        };
        this.delete = function (group, iSongId, line) {
            $cacheFactory.get('$http').remove('/api/song/' + iSongId);
            return $http.delete('/api/group/'+group._id+'/song/' + iSongId + '/line/' + line._id)
                .then(function (response) {
                    return response.data
                })
        }
    })
