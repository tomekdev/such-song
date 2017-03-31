var router = require('express').Router()
var Song = require('../../models/song')
var websockets = require('../../websockets')



router.use('/song/:songId', require('./song'))

router.get('/songs', function (req, res, next) {
    Song.find()
        .select('name author added')
        .populate('lyrics')
        .exec(function (err, posts) {
            if (err) {
                return next(err)
            }
            res.json(posts)
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

router.post('/songs', function (req, res, next) {
    var song = new Song({
        name: req.body.name,
        author: req.body.author
    })
    song.save(function (err, data) {
        if (err) {
            return next(err)
        }
        res.status(201).json(data)
        websockets.broadcast('song.add', song, req.auth)
    })
})


module.exports = router
