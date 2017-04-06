function SongSvc($http) {
    this.$http = $http;
    
    this.add = function (song, groupId) {
        return $http.post('/api/group/' + groupId+'/songs', song)
            .then(function (response) {
                return response.data
         })
    };
    
    this.update = function (song, groupId) {
        return $http.put('/api/group/' + groupId+'/song/' + song._id, song)
            .then(function (response) {
                return response.data
         })
    };
    
    this.delete = function (song, groupId) {
        return $http.delete('/api/group/' + groupId+'/song/' + song._id)
            .then(function (response) {
                return response.data
         })
    };
}

SongSvc.prototype = {        
        get selectedSong() {
            return this._selectedSong;
        },
    
        set selectedSong(song) {
            /*if(!this._selectedSong || this._selectedSong._id !== song._id) {
                this._selectedSong = song;
                var that = this;
                this.$http.get('/api/song/' + song._id, {
                    cache: true
                })
                .then(function (response) {
                    that._selectedSong = response.data
                })
            }*/
            this._selectedSong = song;
        },
        fetchAll: function (groupId, playListId) {
            if (playListId) {
                return this.$http.get('/api/group/'+groupId+'/playlist/'+playListId+'/songs')
                    .then(function (response) {
                        return response.data
                    })
            }
            else {
                return this.$http.get('/api/group/'+groupId+'/songs')
                    .then(function (response) {
                        return response.data
                    })
            }
        },
        fetchOne: function (groupId, iSongId) {
            return this.$http.get('/api/group/'+groupId+'/song/' + iSongId)
                .then(function (response) {
                    return response.data
                })
        },
//        add: function (groupId, song) {
//            return this.$http.post('/api/group/'+groupId+'/songs/', song)
//                .then(function (response) {
//                    return response.data
//                })
//        }
}

angular.module('app')
    .service('SongSvc', SongSvc)
