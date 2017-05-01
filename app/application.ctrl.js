function ApplicationCtrl(SongSvc, LineSvc, UserSvc, WebsocketSvc, GroupSvc, PlaylistSvc, $scope, $location, $mdToast, $mdMedia, $interval, $timeout) {
    this.$mdMedia = $mdMedia;
    this.songSvc = SongSvc;
    this.lineSvc = LineSvc;
    this.userSvc = UserSvc;
    this.groupSvc = GroupSvc;
    this.$location = $location;
    this.flags = {};
    
    var login = () => {
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
    }
    
    $timeout(() => {
        var token = localStorage.getItem("token");
        if (token) {
            UserSvc.token = token;
            WebsocketSvc.connect(UserSvc.token);
            login();
        }
    });
    
    $scope.$on("login", () => {
        login();
    })
    WebsocketSvc.subscribe("playlist.add", (groupId, playlist, username) => {
        if (this.currentGroup._id === groupId) {
            this.playlists.push(playlist);
            $scope.$apply();
        }
        this.showToast(username + ' added playlist "' + playlist.name + '" to "' + this.groups.find((item) => item._id === groupId).name +'"');
    });
    
    WebsocketSvc.subscribe("playlist.update", (groupId, playlist, username) => {
        if (this.currentGroup._id === groupId) {
            this.playlists.forEach((item, i) => {
                if (item._id === playlist._id) {
                    this.playlists[i] = playlist
                }
            });
            $scope.$apply();
        }
        this.showToast(username + ' updated playlist "' + playlist.name + '" in "' + this.groups.find((item) => item._id === groupId).name +'"');
    });
    
    WebsocketSvc.subscribe("playlist.delete", (groupId, playlist, username) => {
        if (this.currentGroup._id === groupId) {
            this.playlists = this.playlists.filter((item) => item._id !== playlist._id);
            $scope.$apply();
        }
        this.showToast(username + ' deleted playlist "' + playlist.name + '" from "' + this.groups.find((item) => item._id === groupId).name +'"');
    });
    
    WebsocketSvc.subscribe("playlist.song.add", (groupId, data, username) => {
        if (this.currentGroup._id === groupId && this.currentPlaylist && this.currentPlaylist._id === data.playlist._id) {
            this.songs.push(data.song);
            $scope.$apply();
        }
        this.showToast(username + ' added song "' + data.song.name + '" to playlist "' + data.playlist.name +'" in "' + this.groups.find((item) => item._id === groupId).name +'"');
    });
    
    WebsocketSvc.subscribe("playlist.song.delete", (groupId, data, username) => {
        if (this.currentGroup._id === groupId && this.currentPlaylist && this.currentPlaylist._id === data.playlist._id) {
            this.songs = this.songs.filter((item) => item._id !== data.song._id)
            $scope.$apply();
        }
        this.showToast(username + ' removed song "' + data.song.name + '" from playlist "' + data.playlist.name +'" in "' + this.groups.find((item) => item._id === groupId).name +'"');

    });
    
    WebsocketSvc.subscribe("group.request.add", (groupId, user) => {
        this.groups.find((item) => item._id === groupId).memberRequests.push(user);
        $scope.$apply;
        this.showToast(user.username + ' wants to join "' + this.groups.find((item) => item._id === groupId).name +'"');
    });
    
    WebsocketSvc.subscribe("group.member.add", (groupId, user, username) => {
        this.showToast(user.username + ' joined "' + this.groups.find((item) => item._id === groupId).name +'"');
    });
    
    WebsocketSvc.subscribe("group.member.accept", (ignore, group) => {
        this.groups.push(group);
        this.showToast('Welcome to ' + group.name);
    });
    
    WebsocketSvc.subscribe("group.member.decline", (ignore, group) => {
        this.showToast('Your request to join "' + group.name + '" was rejected');
    });
    
    WebsocketSvc.subscribe("song.add", (groupId, song, username) => {
        if (this.currentGroup._id === groupId && !this.currentPlaylist) {
            this.songs.push(song);
            $scope.$apply();
        }
        this.showToast(username + ' added song "' + song.name + '" to "' + this.groups.find((item) => item._id === groupId).name +'"');
    });
    
    WebsocketSvc.subscribe("song.update", (groupId, song, username) => {
        if (this.currentGroup._id === groupId && !this.currentPlaylist) {
            this.songs.forEach((item, i) => {
                if (item._id === song._id) {
                    this.songs[i] = song
                }
            });
            $scope.$apply();
        }
        this.showToast(username + ' updated song "' + song.name + '" in "' + this.groups.find((item) => item._id === groupId).name +'"');
    });
    
    WebsocketSvc.subscribe("song.delete", (groupId, song, username) => {
        if (this.currentGroup._id === groupId && !this.currentPlaylist) {
            this.songs = this.songs.filter((item) => item._id !== song._id)
            $scope.$apply();
        }
        this.showToast(username + ' deleted song "' + song.name + '" from "' + this.groups.find((item) => item._id === groupId).name +'"');
    });
    
    
    this.selectSong = (song) => {
        SongSvc.fetchOne(this.currentGroup._id, song._id)
        .then((song) => {
            this.currentSong = song;
            this.clock = 0;
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
            this.currentSong = songs[0];
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
    
    this.showToast = (message) => {
        $mdToast.show($mdToast.simple().textContent(message).position("bottom right"));
    }
    
    this.acceptMember = (group, user, accept) => {
        GroupSvc.acceptMember(group, user, accept)
        .then(() => {
            group.memberRequests.splice(group.memberRequests.indexOf(user), 1);
        })
    }
    
    this.nextSong = () => {
        var newSongIndex = this.songs.findIndex(song => song._id === this.currentSong._id)+1
        if (newSongIndex < this.songs.length) {
            this.currentSong = this.songs[newSongIndex]
            this.clock = 0;
        }
        else {
            this.playing = false;
        }
    }
    
    this.previousSong = () => {
        var newSongIndex = this.songs.findIndex(song => song._id === this.currentSong._id)-1
        if (newSongIndex >= 0) {
            this.currentSong = this.songs[newSongIndex]
            this.clock = 0;
        }
        else {
            this.playing = false;
        }
    }
    
    this.onPlayPause = () => {
        if (this.clock >= this.currentSong.duration.seconds + this.currentSong.duration.minutes*60) {
            this.clock = 0;
        }
        this.playing = !this.playing;
    }
    
    var tick = () => {
        if (this.playing) {
            if(this.clock >= this.currentSong.duration.seconds + this.currentSong.duration.minutes*60) {
                if (this.autoplay && this.currentPlaylist) {
                    this.nextSong()
                }
                else {
                    this.playing = false;
                }
            }
            else {
                this.clock = this.clock + 1 || 0;
            }
            $scope.$digest();
        }
    }
    tick();
    $interval(tick, 1000, 0, false);
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
        localStorage.clear();
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
