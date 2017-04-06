var router = require('express').Router({mergeParams: true})
var User = require('../../../models/user')
var Group = require('../../../models/group')

router.post('/memberrequests', function (req, res, next) {
    Group.findById(req.params.groupId, function (err, group) {
        if (err) {
            return next(err)
        }
        User.findOne({username: req.auth.username}, function (err, user) {
            if (err) {
                return next(err)
            }
            group.memberRequests.push(user);
            group.save(function(err, group){
                if (err) {
                    return next(err)
                }
                user.memberRequests.push(group);
                user.save((err, user) => {
                    if (err) {
                        return next(err)
                    }
                    res.status(201).end();
                })
            })
        })
    })
})


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
            res.status(401).end();
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

router.post('/members', function (req, res, next) {
    User.findById(req.body.userId, function(err, user) {
        if (err) {
            return next(err)
        }
        Group.findById(req.params.groupId)
            .and({memberRequests: user})
            .exec(function (err, group) {
            if (err) {
                return next(err)
            }
            
            user.memberRequests.pull(group);
            user.groups.push(group);
            user.save(function(err, user) {
                if (err) {
                    return next(err)
                }
                group.memberRequests.pull(user);
                group.members.push(user);
                group.save(function(err, group) {
                    if (err) {
                        return next(err)
                    }
                    res.status(201).end();
                })
            })
        })
    })
})


module.exports = router
