function GroupSvc($http) {
    this.fetchAll = function () {
        return $http.get('/api/user/groups')
            .then(function (response) {
                return response.data
         })
    };
    
    this.fetchUserGroups = function () {
        return $http.get('/api//user/groups')
            .then(function (response) {
                return response.data
         })
    };
    
    this.fetchUserMemberRequests = function () {
        return $http.get('/api//user/memberrequests')
            .then(function (response) {
                return response.data
         })
    };
    
    this.fetchUserSuggested = function () {
        return $http.get('/api/user/suggestedgroups')
            .then(function (response) {
                return response.data
         })
    };
    
    this.fetchOne = function (iGroupId) {
        return $http.get('/api/group/'+iGroupId)
            .then(function (response) {
                return response.data
         })
    };
    
    this.add = function (group) {
        return $http.post('/api/groups', group)
            .then(function (response) {
                return response.data
         })
    };
    
    this.update = function (group) {
        return $http.put('/api/group/' + group._id, group)
            .then(function (response) {
                return response.data
         })
    };
    
    this.delete = function (group) {
        return $http.delete('/api/group/' + group._id)
            .then(function (response) {
                return response.data
         })
    };
    
    this.addMemberRequest = function (group) {
        return $http.post('/api/group/' + group._id + '/memberrequests')
            .then(function (response) {
                return response.data
         })
    };
    
    this.acceptMember = function (group, user, accept) {
        return $http.post('/api/group/' + group._id + '/members', {
            userId: user._id,
            accept: accept
        })
            .then(function (response) {
                return response.data
         })
    };
}

angular.module('app')
    .service('GroupSvc', GroupSvc)
