function UserSvc($http) {
    this.$http = $http;
}

UserSvc.prototype = {
    login: function (username, password) {
        var that = this;
        return this.$http.post('/api/sessions', {
            username: username,
            password: password
        }).then(function (response) {
            //      svc.token = response.data
            that.token = response.data;
            that.$http.defaults.headers.common['X-Auth'] = response.data;
            that.currentUser = username;
            return username; //svc.getUser()
        })
    },
    logout: function () {
        this.currentUser = null;
    }
}

angular.module('app')
    .service('UserSvc', UserSvc)
