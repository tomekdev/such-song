var router = require('express').Router({
    mergeParams: true
})
var bodyParser = require('body-parser')
var Line = require('../../../models/line')
var Song = require('../../../models/song')

router.use(bodyParser.json())

router.post('/lines', function (req, res, next) {
    var line = new Line({
        text: req.body.text
    })
    Song.findById(req.params.songId, function (err, song) {
        if (err) {
            return next(err)
        }
        line.save(function (err, post) {
            if (err) {
                return next(err)
            }
            song.lyrics.splice(req.body.position !== undefined? req.body.position : song.lyrics.length, 0, line);
            song.save(function (err, post) {
                if (err) {
                    line.remove();
                    return next(err)
                }
            })
            res.status(201).json(post)
        })

    });
})

router.put('/line/:lineId', function (req, res, next) {
    Line.findById(req.params.lineId, function (err, line) {
        if (err) {
            return next(err)
        }
        if (!!req.body.text) {
            line.text = req.body.text;
            line.save(function (err, post) {
                if (err) {
                    return next(err)
                }
            });
        }
        if (!!req.body.position) {
            Song.findById(req.params.songId, function (err, song) {
                if (err) {
                    return next(err)
                }
                song.lyrics.splice(song.lyrics.indexOf(req.params.lineId), 1);
                song.lyrics.splice(req.body.position, 0, line);
                song.save(function (err, post) {
                    if (err) {
                        return next(err)
                    }
                });
            });
        }
        res.status(200).json(line)
    });
})

router.delete('/line/:lineId', function (req, res, next) {
    Line.findById(req.params.lineId, function (err, line) {
        if (err) {
            return next(err)
        }
        Song.findById(req.params.songId, function (err, song) {
            if (err) {
                return next(err)
            }
            song.lyrics.splice(song.lyrics.indexOf(req.params.lineId), 1);
            song.save(function (err, post) {
                if (err) {
                    return next(err)
                }
                line.remove(function (err) {
                    if (err) {
                        return next(err)
                    }
                    res.status(200).json(line)
                });
            });
        });
    });
});

module.exports = router
