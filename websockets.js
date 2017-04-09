var _ = require('lodash')
var ws = require('ws')
var jwt = require('jwt-simple')
var config = require('./config')
var User = require('./models/user')

var groups = []
var clients = []

exports.connect = function (server) {
    var wss = new ws.Server({
        server: server
    })
    wss.on('connection', function (ws) {
        var token = ws.upgradeReq.url.substr(1);
        ws.auth = jwt.decode(token, config.secret);
        User.findOne({username: ws.auth.username})
             .populate('groups')
             .exec((err, user) => {
            if (err) {
                return next(err)
            }
            user.groups.forEach((group) => {
                if (!groups[group.id]) {
                    groups[group.id] = [];
                }
                groups[group.id].push(ws);
            })
            clients.push(ws);
        });
        ws.on('close', function () {
            groups.forEach( (group) => {
                _.remove(group, ws)
            })
            _.remove(clients, ws)
        });
        ws.on("message", function (message) {
            var data = JSON.parse(message);
            User.findOne({username: ws.auth.username, group: data.groupId})
            .populate('groups')
            .exec((err, user) => {
                if (err) {
                    return next(err)
                }
                if (Array.isArray(groups[data.groupId])) {
                    groups[data.groupId].forEach(function (client) {
                        if (client !== ws) {
                            client.send(message, (error) => {})
                        }
                    })
                }
            });
        });
    })
}

exports.broadcast = function (group, event, data, sender) {
    var json = JSON.stringify({
        groupId: group,
        event: event,
        data: data,
        sender: sender.username
    })
    if (Array.isArray(groups[group])) {
        groups[group].forEach(function (client) {
            if (!sender || client.auth.username !== sender.username || client.auth.timestamp !== sender.timestamp) {
                client.send(json, (error) => {})
            }
        })
    }
}

exports.addUserToGroup = function(username, groupId) {
    user = clients.find((client) => client.auth.username === username)
    if (user) {
        if (!groups[groupId]) {
            groups[groupId] = [];
        }
        groups[groupId].push(user);
    }
}

exports.sendToUser = function(username, event, data) {
    user = clients.find((client) => client.auth.username === username)
    if (user) {
        var json = JSON.stringify({
            event: event,
            data: data
        })
        user.send(json, (error) => {})
    }
}
