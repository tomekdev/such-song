var router = require('express').Router()
var bodyParser = require('body-parser')
var Song = require('../../models/song')

router.use(bodyParser.json())

router.get('/songs', function (req, res) {
    Song.find()
        .select('name added')
        .exec(function (err, posts) {
            if (err) {
                return next(err)
            }
            res.json(posts)
        })
})

router.post('/songs', function (req, res, next) {
    var song = new Song({
        name: req.body.name
    })
    song.save(function (err, post) {
        if (err) {
            return next(err)
        }
        res.status(201).json(post)
    })
})

module.exports = router
