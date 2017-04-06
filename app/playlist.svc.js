function PlaylistSvc($http) {
    this.fetchAll = function (iGroupId) {
        return $http.get('/api/group/'+iGroupId+'/playlists')
            .then(function (response) {
                return response.data
         })
    };
    
    this.fetchOne = function (iGroupId, iPlaylistId) {
        return $http.get('/api/group/'+iGroupId+'/playlist/'+iPlaylistId)
            .then(function (response) {
                return response.data
         })
    };
    
    this.add = function (playlist, groupId) {
        return $http.post('/api/group/' + groupId+'/playlists', playlist)
            .then(function (response) {
                return response.data
         })
    };
    
    this.update = function (playlist, groupId) {
        return $http.put('/api/group/' + groupId+'/playlist/' + playlist._id, playlist)
            .then(function (response) {
                return response.data
         })
    };
    
    this.delete = function (playlist, groupId) {
        return $http.delete('/api/group/' + groupId+'/playlist/' + playlist._id)
            .then(function (response) {
                return response.data
         })
    };
    
    this.addSong = function (song, groupId, playlistId) {
        return $http.post('/api/group/' + groupId+'/playlist/' + playlistId + '/songs', {songId: song._id})
            .then(function (response) {
                return response.data
         })
    };
    
    this.deleteSong = function (song, groupId, playlistId) {
        return $http.delete('/api/group/' + groupId+'/playlist/' + playlistId + '/song/' + song._id)
            .then(function (response) {
                return response.data
         })
    };
}

angular.module('app')
    .service('PlaylistSvc', PlaylistSvc)