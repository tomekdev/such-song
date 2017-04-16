function WebsocketSvc($window) {
    this.$window = $window;
    this.callbacks = {};
}

WebsocketSvc.prototype = {
    connect: function (token, timeout) {
        var that = this;
        var host
        var connectionOpen;
        if (this.$window.location.protocol === "https:") {
            host = "wss://"
        } else {
            host = "ws://"
        }
        host += this.$window.location.host;
        host += "/" + token
        this.connection = new WebSocket(host);
        this.connection.onmessage = function (e) {
            var input = JSON.parse(e.data),
                event = input.event,
                data = input.data,
                groupId = input.groupId,
                username = input.sender;
            (that.callbacks[event] || []).forEach(function (callback) {
                callback(groupId, data, username);
            });
        }
        this.connection.onclose = (e) => {
            connectionOpen = false;
            setTimeout(this.connect.bind(this,token,timeout? timeout+1000 : 2000), timeout || 1000);
        }
        this.connection.onopen = (e) => {
            connectionOpen = true;
            setTimeout(ping,25000);
        }
        
        var ping = () => {
            this.connection.send("!");
            if (connectionOpen) {
                setTimeout(ping, 25000);
            }
        }
    },
    send: function (groupId, event, data) {
        this.connection.send(JSON.stringify({
            "event": event,
            "data": data,
            "groupId": groupId
        }));
    },
    subscribe: function (event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = []
        }
        this.callbacks[event].push(callback);
    }
}

angular.module('app')
    .service('WebsocketSvc', WebsocketSvc)
