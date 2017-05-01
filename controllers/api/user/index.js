var router = require('express').Router({mergeParams: true})
var Group = require('../../../models/group')
var User   = require('../../../models/user')

router.get('/', function (req, res, next) {
    User.findOne({
        username: req.auth.username
    })
    .select('lastGroup username')
    .populate('lastGroup')
    .exec(function(err, user){
        if (err) {
            return next(err)
        }
        res.json(user);
    })
})

router.put('/', function (req, res, next) {
    User.findOne({
        username: req.auth.username
    })
        .exec(function(err, user){
        if (err) {
            return next(err)
        }
        user.lastGroup = req.body.lastGroup;
        user.save(function(err, user) {
            if (err) {
                return next(err)
            }
            res.status(200).end();
        })
    })
})

router.get('/groups', function (req, res, next) {
    User.findOne({
        username: req.auth.username
    })
        .populate({
          path: 'groups',
          model: 'group',
          populate: {
            path: 'memberRequests',
            select: 'username _id',
            model: 'user'
          }
        })
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
        Group.find({$and:[
            { _id: { $nin: user.groups } },
            { _id: { $nin: user.memberRequests } }
        ]})
            .exec(function (err, groups) {
                if (err) {
                    return next(err)
                }
                res.json(groups)
            })
    });
})

module.exports = router
