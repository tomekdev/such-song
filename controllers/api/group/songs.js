var router = require('express').Router({
    mergeParams: true
})
var Song = require('../../../models/song')
var Group = require('../../../models/group')
var websockets = require('../../../websockets')


router.use('/song/:songId', require('./song'))

router.get('/songs', function (req, res, next) {
    Group.findById(req.params.groupId)
        .populate('songs', '-lyrics')
        .exec(function (err, group) {
        if (err) {
            return next(err)
        }
        res.json(group.songs)
    })
})

router.get('/song/:songId', function (req, res, next) {
    Song.findById(req.params.songId)
        .populate('lyrics')
        .exec(function (err, posts) {
            if (err) {
                return next(err)
            }
            res.json(posts)
        })
})


router.put('/song/:songId', function (req, res, next) {
    Song.findById(req.params.songId)
        .exec(function (err, song) {
            if (err) {
                return next(err)
            }
            song.name = req.body.name;
            song.author = req.body.author;
            song.duration.minutes = req.body.duration? req.body.duration.minutes : null;
            song.duration.seconds = req.body.duration? req.body.duration.seconds : null;
            song.save(function (err, song) {
                if (err) {
                    return next(err)
                }
                websockets.broadcast(req.params.groupId, 'song.update', song, req.auth)
                res.json(song)
            })
        })
})

router.delete('/song/:songId', function (req, res, next) {
    Song.findById(req.params.songId)
        .exec(function (err, song) {
            if (err) {
                return next(err)
            }
            song.remove(function (err) {
                if (err) {
                    return next(err)
                }
                websockets.broadcast(req.params.groupId, 'song.delete', song, req.auth)
                res.status(200).end();
            })
        })
})

router.post('/songs', function (req, res, next) {
    var song = new Song({
        name: req.body.name,
        author: req.body.author,
        duration: {
            minutes: req.body.duration? req.body.duration.minutes : null,
            seconds: req.body.duration? req.body.duration.seconds : null
        }
    })
    Group.findById(req.params.groupId, function (err, group) {
        if (err) {
            return next(err)
        }
        song.save(function (err, data) {
            if (err) {
                return next(err)
            }
            group.songs.push(song);
            group.save(function (err, data) {
                if (err) {
                    song.remove();
                    return next(err)
                }
            })
            websockets.broadcast(req.params.groupId, 'song.add', song, req.auth)
            res.status(201).json(data)
        })

    });
})


module.exports = router
