function ApplicationCtrl(SongSvc, LineSvc, UserSvc, WebsocketSvc, GroupSvc, PlaylistSvc, $scope, $location) {
    this.songSvc = SongSvc;
    this.lineSvc = LineSvc;
    this.userSvc = UserSvc;
    this.groupSvc = GroupSvc;
    this.$location = $location;
    this.flags = {};
    
    $scope.$on("login", () => {
        GroupSvc.fetchAll().then((groups) => {
            this.groups = groups;
            this.flags.showSideNav = true;
        });
        
        UserSvc.getUserInfo().then((user) => {
            this.currentGroup = user.lastGroup;
            if (user.lastGroup) {
                this.selectGroup(user.lastGroup);
            }
        })
    })
    
    WebsocketSvc.subscribe("song.add", (song) => {
        this.songs.push(song);
        $scope.$apply();
    });
    
    this.selectSong = (song) => {
        SongSvc.fetchOne(this.currentGroup._id, song._id)
        .then((song) => {
            this.currentSong = song;
            SongSvc.selectedSong = song;
            $location.path('/song')
        })
    }
    
    this.addSong = (song) => {
        if (song.name && !song._id) {       
            SongSvc.add(song, this.currentGroup._id)
            .then((response) => {
                if (this.currentPlaylist) {
                    PlaylistSvc.addSong(song, this.currentGroup._id, this.currentPlaylist._id)
                    .then((response) => {
                        this.songs.push(response);
                        this.song = null;
                    });
                }
                else {
                    this.songs.push(response);
                    this.song = null;
                }
            });
        }
        else if (song._id && this.currentPlaylist) {
            PlaylistSvc.addSong(song, this.currentGroup._id, this.currentPlaylist._id)
            .then((response) => {
                this.songs.push(response);
                this.song = null;
            });
        }
    }
     
    this.updateSong = (song) => {
        SongSvc.update(song, this.currentGroup._id)
    }
    
    this.deleteSong = (song) => {
        if (this.currentPlaylist) {
            PlaylistSvc.deleteSong(song, this.currentGroup._id, this.currentPlaylist._id)
            .then(()=>{
                this.songs.splice(this.songs.indexOf(song),1);
            });
        }
        else {
            SongSvc.delete(song, this.currentGroup._id)
            .then(() => {
                this.songs.splice(this.songs.indexOf(song),1);
            });
        }
    }
    
    this.selectPlaylist = (playlist) => {
        this.currentPlaylist = playlist;
        SongSvc.fetchAll(this.currentGroup._id, playlist? playlist._id : null)
        .then((songs) => {
            this.songs = songs;
        });
    }
    
    this.addPlaylist = (playlist) => {
        PlaylistSvc.add(playlist, this.currentGroup._id)
        .then((response) => {
            this.playlists.push(response);
            this.playlist = null;
        });
    }
     
    this.updatePlaylist = (playlist) => {
        PlaylistSvc.update(playlist, this.currentGroup._id)
    }
    
    this.deletePlaylist = (playlist) => {
        PlaylistSvc.delete(playlist, this.currentGroup._id)
        .then(() => {
            this.playlists.splice(this.playlists.indexOf(playlist),1);
        });
    }
    
    this.selectGroup = (group) => {
        this.currentGroup = group;
        PlaylistSvc.fetchAll(group._id).then((playlists) => {
            this.playlists = playlists;
        });
        SongSvc.fetchAll(group._id).then((songs) => {
            this.allSongs = this.songs = songs;
        });
        UserSvc.setLastGroup(group);
        this.flags.expandSongs = true;
    }
    
    this.manageGroups = () => {
        this.$location.path('/groups')
    }
}

ApplicationCtrl.prototype = {
    get groups() {
        return this.groupSvc.userGroups;
    },
    
    set groups(groups) {
        this.groupSvc.userGroups = groups;
    },
    get currentGroup() {
        return this.groupSvc.currentGroup;
    },
    
    set currentGroup(currentGroup) {
        this.groupSvc.currentGroup = currentGroup;
    },
    get user() {
        return this.userSvc.currentUser;
    },
    logout: function () {
        this.userSvc.logout();
        this.flags.showSideNav = false;
        this.songs = null;
        this.playlists = null;
        this.groups = null;
        this.$location.path('/login')
    },
 /*   addSong: function () {
        var that = this;
        this.songSvc.add(this.newSong)
            .then(function (song) {
                that.songs.push(song)
                that.flags.addSong = false;
                that.newSong = {};
            });
    },
    selectSong: function (song) {
        this.songSvc.fetchOne(this.currentGroup._id, song._id).then((song) => {
            this.songSvc.selectedSong = song;
            this.$location.path('/song')
        })
    }*/
};

angular.module('app')
    .controller('ApplicationCtrl', ApplicationCtrl);
