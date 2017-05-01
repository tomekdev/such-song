function UserSvc($http) {
    this.$http = $http;
    this.login = function (username, password) {
        return $http.post('/api/sessions', {
            username: username,
            password: password
        }).then((response) => {
            this.token = response.data;
            this.currentUser = { username: username};
            return username; //svc.getUser()
        })
    }
    
    this.logout = function () {
        this.currentUser = null;
    }
    
    this.getUserInfo = function (group) {
        return $http.get('/api/user')
        .then((response) => {
            this.currentUser = response.data;
            return response.data; //svc.getUser()
        })
    }
    
    this.setLastGroup = function (group) {
        return $http.put('/api/user', {
            lastGroup: group._id
        }).then((response) => {
            return true; //svc.getUser()
        })
    }
}

UserSvc.prototype = {
    set token(token) {
        this._token = token;
        this.$http.defaults.headers.common['X-Auth'] = token;
    },
    
    get token() {
        return this._token;
    }
}

angular.module('app')
    .service('UserSvc', UserSvc)
