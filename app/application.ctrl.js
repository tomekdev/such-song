angular.module('app')
    .controller('ApplicationCtrl', function ($scope, $mdSidenav, SongSvc) {

        $scope.selectSong = selectSong;
        $scope.addSong = addSong;

        SongSvc.fetchAll()
            .then(function (songs) {
                $scope.songs = songs;
            });

        function selectSong(song) {
            $scope.song = song;
            $scope.$broadcast("song_selected", song);
        }

        function addSong() {
            SongSvc.add($scope.newSong)
                .then(function (song) {
                    $scope.songs.push(song)
                    $scope.flags.addSong = false;
                });
        }
    })
