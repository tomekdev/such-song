function LoginCtrl($scope, $location, UserSvc, WebsocketSvc) {

    this.login = function(username, password) {
        this.loginError = null;
        UserSvc.login(username, password)
            .then((user)  => {
                localStorage.setItem("token", UserSvc.token)
                WebsocketSvc.connect(UserSvc.token);
                this.flags.loginBusy = false;
                $location.path('/')
                $scope.$emit("login");
            }, () => {
                this.flags.loginBusy = false;
                this.loginError = "Bad username or password";
        })
    }
}

angular.module('app')
    .controller('LoginCtrl', LoginCtrl);
