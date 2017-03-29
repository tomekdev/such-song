var _ = require('lodash')
var ws = require('ws')

var clients = []

exports.connect = function (server) {
    var wss = new ws.Server({
        server: server
    })
    wss.on('connection', function (ws) {
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

exports.broadcast = function (topic, data) {
    var json = JSON.stringify(data)
    clients.forEach(function (client) {
        client.send(json)
    })
}
