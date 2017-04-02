var router = require('express').Router({mergeParams: true})
var User = require('../../../models/user')
var Group = require('../../../models/group')


router.use(function(req, res, next) {
    User.findOne({
        username: req.auth.username,
        groups: req.params.groupId
    }).exec(function(err, user){
        if (err) {
            return next(err)
        }
        if (user) {
            next();
        }
        else {
            res.sendStatus(401);
        }
    })
});

router.use(require('./playlists'))
router.use(require('./songs'))

router.get('/', function (req, res, next) {
    Group.findById(req.params.groupId)
        .populate("playlists")
        .exec(function (err, groups) {
            if (err) {
                return next(err)
            }
            res.json(groups)
        })
})


module.exports = router
