angular.module('app')
    .controller('SongCtrl', function ($scope, SongSvc, LineSvc) {

        $scope.addLine = addLine;
        $scope.updateLine = updateLine;
        $scope.deleteLine = deleteLine;
        $scope.saveLines = saveLines;
        $scope.dismissLines = dismissLines;

        $scope.$on("song_selected", function (_, song) {
            SongSvc.fetchOne(song._id)
                .then(function (song) {
                    $scope.song.lyrics = song.lyrics;
                });
        })

        function addLine(iPosition) {
            line = {
                tex: "",
                dirty: true
            };
            $scope.song.lyrics.splice(iPosition, 0, line);
            LineSvc.add($scope.song._id, {
                    position: iPosition
                })
                .then(function (response) {
                    line._id = response._id;
                    line.dirty = false;
                })
        }

        function updateLine(line) {
            LineSvc.update($scope.song._id, line)
                .then(function (response) {
                    line.dirty = false;
                })
        }

        function deleteLine(line, iPosition) {
            LineSvc.delete($scope.song._id, line)
                .then(function (response) {
                    $scope.song.lyrics.splice(iPosition, 1);
                })
        }

        function saveLines() {
            $scope.song.lyrics.forEach(function (line) {
                if (line.dirty) {
                    updateLine(line);
                }
            })
            $scope.flags.editSong = false;
        }

        function dismissLines() {
            SongSvc.fetchOne($scope.song._id)
                .then(function (song) {
                    $scope.song = song;
                    $scope.flags.editSong = false;
                })
        }
    })
