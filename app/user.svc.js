function UserSvc($http) {
    
    this.login = function (username, password) {
        return $http.post('/api/sessions', {
            username: username,
            password: password
        }).then((response) => {
            this.token = response.data;
            $http.defaults.headers.common['X-Auth'] = response.data;
            this.currentUser = username;
            return username; //svc.getUser()
        })
    }
    
    this.logout = function () {
        this.currentUser = null;
    }
    
    this.getUserInfo = function (group) {
        return $http.get('/api/user')
            .then((response) => {
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

angular.module('app')
    .service('UserSvc', UserSvc)
