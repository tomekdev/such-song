function SongController($scope, SongSvc, LineSvc, UserSvc, WebsocketSvc, GroupSvc) {
    this.songSvc = SongSvc;
    this.userSvc = UserSvc;
    this.lineSvc = LineSvc;
    this.groupSvc = GroupSvc;
    this.websocketSvc = WebsocketSvc;
    
    WebsocketSvc.subscribe("line.add", (groupId, data) => {
        if (data.song_id === SongSvc.selectedSong._id) {
            SongSvc.selectedSong.lyrics.splice(data.position, 0, data.line);
            $scope.$apply();
        }
    })
    
    WebsocketSvc.subscribe("line.update", (groupId, data) => {
        if (data.song_id === SongSvc.selectedSong._id) {
            SongSvc.selectedSong.lyrics.filter((line) => line._id === data.line._id).forEach((line) => {
                line.text = data.line.text;
                line.editor = data.username;
            });
            $scope.$apply();
        }
    })
    
    WebsocketSvc.subscribe("line.save", (groupId, data) => {
        if (data.song_id === SongSvc.selectedSong._id) {
            SongSvc.selectedSong.lyrics.filter((line) => line._id === data.line._id).forEach((line) => line.editor=false);
            $scope.$apply();
        }
    })
    
    WebsocketSvc.subscribe("line.delete", (groupId, data) => {
        if (data.song_id === SongSvc.selectedSong._id) {
            SongSvc.selectedSong.lyrics = SongSvc.selectedSong.lyrics.filter((line) => line._id !== data.line._id);
            $scope.$apply();
        }
    })
    
    var paths = document.getElementsByTagName('path');
    var visualizer = document.getElementById('visualizer');
    var mask = visualizer.getElementById('mask');
    var path;
    var report = 0;
    
    var soundAllowed = function (stream) {
        window.persistAudioStream = stream;
        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource( stream );
        var analyser = audioContent.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = 4096;
        analyser.minDecibels = -80;

        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
      
        for (var i = 0 ; i < 64; i++) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            mask.appendChild(path);
        }
        var doDraw = function () {
            setTimeout(doDraw,50);
            analyser.getByteFrequencyData(frequencyArray);
          	var adjustedLength;
            for (var i = 0 ; i < 64; i++) {
              	adjustedLength = frequencyArray[i+5];
                paths[i].setAttribute('d', 'M '+ (i*4+2) +',255 l 0,-' + adjustedLength);

            }

        }
        doDraw();
    }
    navigator.getUserMedia({audio:true}, soundAllowed, () => {});

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
        this.lineSvc.add(this.groupSvc.currentGroup, this.songSvc.selectedSong._id, {
                position: iPosition
            })
            .then(function (response) {
                line._id = response._id;
                line.dirty = false;
            });
    },
    
    changeLine: function(e, line, index) {
        if (e.keyCode === 13 )
        {
            this.addLine(index+1)
        }
        else {
            this.websocketSvc.send(this.groupSvc.currentGroup._id, "line.update", {
                song_id: this.songSvc.selectedSong._id,
                line: line,
                username: this.userSvc.currentUser
            })
        }
    },
    
    updateLine: function (line) {
        this.lineSvc.update(this.groupSvc.currentGroup, this.songSvc.selectedSong._id, line)
            .then(function (response) {
                line.dirty = false;
            })
    },

    deleteLine: function (line, iPosition) {
        this.lineSvc.delete(this.groupSvc.currentGroup, this.songSvc.selectedSong._id, line)
            .then((response) => {
                this.songSvc.selectedSong.lyrics.splice(iPosition, 1);
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
