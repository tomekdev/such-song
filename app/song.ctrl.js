function SongController($scope, SongSvc, LineSvc, WebsocketSvc) {
    this.songSvc = SongSvc;
    this.lineSvc = LineSvc;
    this.websocketSvc = WebsocketSvc;
    WebsocketSvc.subscribe("line.add", (data) => {
        if (data.song_id === SongSvc.selectedSong._id) {
            SongSvc.selectedSong.lyrics.splice(data.position, 0, data.line);
            $scope.$apply();
        }
    })
}

SongController.prototype = {
    get selectedSong() {
        return this.songSvc.selectedSong;
    },
    set selectedSong(song) {
        this.songSvc.selectedSong = song;
    },
    addLine: function (iPosition) {
        var line = {
            tex: "",
            dirty: true
        };
        setTimeout(function () {
            document.getElementById("line_" + iPosition).focus();
        }, 100)
        this.songSvc.selectedSong.lyrics.splice(iPosition, 0, line);
        this.lineSvc.add(this.songSvc.selectedSong._id, {
                position: iPosition
            })
            .then(function (response) {
                line._id = response._id;
                line.dirty = false;
            });
    },
    updateLine: function (line) {
        this.lineSvc.update(this.songSvc.selectedSong._id, line)
            .then(function (response) {
                line.dirty = false;
            })
    },

    deleteLine: function (line, iPosition) {
        this.lineSvc.delete($scope.song._id, line)
            .then(function (response) {
                $scope.song.lyrics.splice(iPosition, 1);
            })
    },

    saveLines: function () {
        var that = this;
        this.songSvc.selectedSong.lyrics.forEach(function (line) {
            if (line.dirty) {
                that.updateLine(line);
            }
        })
        this.flags.editSong = false;
    },

    dismissLines: function () {
        var that = this;
        this.songSvc.fetchOne(this.songSvc.selectedSong._id)
            .then(function (song) {
                that.songSvc.selectedSong = song;
                that.flags.editSong = false;
            })
    }
};

angular.module('app')
    .controller('SongCtrl', SongController);
