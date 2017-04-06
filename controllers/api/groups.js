var router = require('express').Router()
var Group = require('../../models/group')
var User = require('../../models/user')
var websockets = require('../../websockets')


router.post('/groups', function (req, res, next) {
    var group = new Group({
        name: req.body.name
    })
    User.findOne({username: req.auth.username}, function (err, user) {
        if (err) {
            return next(err)
        }
        group.save(function (err, data) {
            if (err) {
                return next(err)
            }
            
            user.groups.push(group);
            user.save(function (err, data) {
                if (err) {
                    group.remove();
                    return next(err)
                }
                res.status(201).json(group)
            })
        })

    });
})

router.get('/groups', function (req, res, next) {
    User.findOne({username: req.auth.username})
        .populate('groups')
        .exec(function (err, user) {
        if (err) {
            return next(err)
        }
        res.json(user.groups);
    });
})

router.use('/group/:groupId', require('./group'))

module.exports = router
