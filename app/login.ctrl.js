function LoginCtrl(UserSvc, WebsocketSvc, $location) {
    this.userSvc = UserSvc;
    this.websocketSvc = WebsocketSvc;
    this.$location = $location;
}

LoginCtrl.prototype = {
    login: function (username, password) {
        var that = this;
        this.userSvc.login(username, password)
            .then(function (user) {
                that.websocketSvc.connect();
                that.flags.loginBusy = false;
                that.$location.path('/')
            })
    }
};

angular.module('app')
    .controller('LoginCtrl', LoginCtrl);
