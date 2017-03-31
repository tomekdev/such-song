function ApplicationCtrl(SongSvc, LineSvc, UserSvc, WebsocketSvc, $scope, $location) {
    var that = this;
    this.songSvc = SongSvc;
    this.lineSvc = LineSvc;
    this.userSvc = UserSvc;
    this.$location = $location;
    SongSvc.fetchAll().then(function(songs){
        that.songs = songs;
    });
    WebsocketSvc.subscribe("song.add", (song) => {
        this.songs.push(song);
        $scope.$apply();
    });
}

ApplicationCtrl.prototype = {
    get user() {
        return this.userSvc.currentUser;
    },
    logout: function() {
        this.userSvc.logout();
        this.$location.path('/login')
    },
    addSong: function() {
        var that = this;
        this.songSvc.add(this.newSong)
            .then(function (song) {
                that.songs.push(song)
                that.flags.addSong = false;
                that.newSong = {};
            });
    },
    selectSong: function (song) {
        this.songSvc.selectedSong = song;
    }
};

angular.module('app')
    .controller('ApplicationCtrl', ApplicationCtrl);
