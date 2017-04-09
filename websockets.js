var _ = require('lodash')
var ws = require('ws')
var jwt    = require('jwt-simple')
var config = require('./config')

var clients = []

exports.connect = function (server) {
    var wss = new ws.Server({
        server: server
    })
    wss.on('connection', function (ws) {
        var token = ws.upgradeReq.url.substr(1);
        ws.auth = jwt.decode(token, config.secret);
        clients.push(ws)
        ws.on('close', function () {
            _.remove(clients, ws)
        });
        ws.on("message", function (message) {
            clients.forEach(function (client) {
                if (client !== ws) {
                    client.send(message)
                }
            })
        });
    })
}

exports.broadcast = function (group, event, data, sender) {
    var json = JSON.stringify({event: event, data: data})
    clients.forEach(function (client) {
        if (!sender || client.auth.username !== sender.username || client.auth.timestamp !== sender.timestamp) {
            client.send(json)
        }
    })
}
