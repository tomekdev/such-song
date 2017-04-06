var router = require('express').Router({
    mergeParams: true
})
var Playlist = require('../../../models/playlist')
var Group = require('../../../models/group')
var Song = require('../../../models/song')
var websockets = require('../../../websockets')

router.get('/playlist/:playlistId', function (req, res, next) {
    Playlist.findById(req.params.playlistId)
        .populate("songs")
        .exec(function (err, playlist) {
            if (err) {
                return next(err)
            }
            res.json(playlist)
        })
})

router.get('/playlist/:playlistId', function (req, res, next) {
    Playlist.findById(req.params.playlistId)
        .populate("songs")
        .exec(function (err, playlist) {
            if (err) {
                return next(err)
            }
            res.json(playlist)
        })
})

router.put('/playlist/:playlistId', function (req, res, next) {
    Playlist.findById(req.params.playlistId)
        .exec(function (err, playlist) {
            if (err) {
                return next(err)
            }
            playlist.name = req.body.name;
            playlist.save(function (err, playlist) {
                if (err) {
                    return next(err)
                }
                res.json(playlist)
            })
        })
})

router.delete('/playlist/:playlistId', function (req, res, next) {
    Playlist.findById(req.params.playlistId)
        .exec(function (err, playlist) {
            if (err) {
                return next(err)
            }
            playlist.remove(function (err) {
                if (err) {
                    return next(err)
                }
                res.status(200).end();
            })
        })
})

router.get('/playlists', function (req, res, next) {
    Group.findById(req.params.groupId)
        .populate('playlists')
        .exec(function (err, group) {
        if (err) {
            return next(err)
        }
        res.json(group.playlists)
    })
})

router.post('/playlists', function (req, res, next) {
    var playlist = new Playlist({
        name: req.body.name
    })
    Group.findById(req.params.groupId, function (err, group) {
        if (err) {
            return next(err)
        }
        playlist.save(function (err, data) {
            if (err) {
                return next(err)
            }
            group.playlists.push(playlist);
            group.save(function (err, data) {
                if (err) {
                    playlist.remove();
                    return next(err)
                }
            })
            websockets.broadcast('playlist.add', {
                group_id: req.params.groupId,
                playlist: playlist
            }, req.auth);
            res.status(201).json(data)
        })

    });
})

router.get('/playlist/:playlistId/songs', function (req, res, next) {
    Playlist.findById(req.params.playlistId)
        .populate('songs')
        .exec(function (err, playlist) {
        if (err) {
            return next(err)
        }
       res.json(playlist.songs)
    });
})

router.post('/playlist/:playlistId/songs', function (req, res, next) {
    Playlist.findById(req.params.playlistId, function (err, playlist) {
        if (err) {
            return next(err)
        }
        Song.findById(req.body.songId, function (err, song) {
            if (err) {
                return next(err)
            }
            playlist.songs.push(song);
            playlist.save(function (err, data) {
                if (err) {
                    return next(err)
                }
                res.status(201).json(song)
            });
        });
    });
})

router.delete('/playlist/:playlistId/song/:songId', function (req, res, next) {
    Playlist.findById(req.params.playlistId, function (err, playlist) {
        if (err) {
            return next(err)
        }
        Song.findById(req.params.songId, function (err, song) {
            if (err) {
                return next(err)
            }
            playlist.songs.pull(song);
            playlist.save(function (err, data) {
                if (err) {
                    return next(err)
                }
                res.status(200).end()
            });
        });
    });
})

module.exports = router
