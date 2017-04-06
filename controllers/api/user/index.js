var router = require('express').Router({mergeParams: true})
var Group = require('../../../models/group')
var User   = require('../../../models/user')

router.get('/groups', function (req, res, next) {
    User.findOne({
        username: req.auth.username
    })
        .populate('groups')
        .exec(function(err, user){
        if (err) {
            return next(err)
        }
        res.json(user.groups);
    });
})

router.get('/memberrequests', function (req, res, next) {
     User.findOne({
        username: req.auth.username
    })
        .populate('memberRequests')
        .exec(function(err, user){
        if (err) {
            return next(err)
        }
        res.json(user.memberRequests);
    });
})

router.get('/suggestedgroups', function (req, res, next) {
    User.findOne({
        username: req.auth.username
    })
        .exec(function(err, user){
        if (err) {
            return next(err)
        }
        Group.find( { _id: { $nin: user.groups } })
            .exec(function (err, groups) {
                if (err) {
                    return next(err)
                }
                res.json(groups)
            })
    });
})

module.exports = router
