function SongSvc($http) {
        this.$http = $http;
}

SongSvc.prototype = {        
        get selectedSong() {
            return this._selectedSong;
        },
    
        set selectedSong(song) {
            if(!this._selectedSong || this._selectedSong._id !== song._id) {
                this._selectedSong = song;
                var that = this;
                this.$http.get('/api/song/' + song._id/*, {
                    cache: true
                }*/)
                .then(function (response) {
                    that._selectedSong = response.data
                })
            }
        },
        fetchAll: function () {
            return this.$http.get('/api/songs')
                .then(function (response) {
                    return response.data
                })
        },
        fetchOne: function (iSongId) {
            return this.$http.get('/api/song/' + iSongId, {
                    cache: true
                })
                .then(function (response) {
                    return response.data
                })
        },
        add: function (song) {
            return this.$http.post('/api/songs/', song)
                .then(function (response) {
                    return response.data
                })
        }
}

angular.module('app')
    .service('SongSvc', SongSvc)
