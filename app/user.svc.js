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
}

angular.module('app')
    .service('UserSvc', UserSvc)
