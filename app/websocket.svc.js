function WebsocketSvc($window) {
    this.$window = $window;
    this.callbacks = {};
}

WebsocketSvc.prototype = {
    connect: function () {
        var that = this;
        var host
        if (this.$window.location.protocol === "https:") {
            host = "wss://" + this.$window.location.host
        } else {
            host = "ws://" + this.$window.location.host
        }
        this.connection = new WebSocket(host);
        this.connection.onmessage = function (e) {
            var input = JSON.parse(e.data),
                event = input.event,
                data = input.data;
            (that.callbacks[event] || []).forEach(function (callback) {
                callback(data);
            });
        }

    },
    send: function (event, data) {
        this.connection.send(JSON.stringify({
            "event": event,
            "data": data
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