function GroupCtrl(SongSvc, LineSvc, UserSvc, WebsocketSvc, GroupSvc, PlaylistSvc, $scope, $location) {
    this.groupSvc = GroupSvc;
    this.flags = {};
    
    GroupSvc.fetchUserGroups()
        .then((groups) => {
        this.userGroups = groups;
    })
    
    GroupSvc.fetchUserMemberRequests()
        .then((groups) => {
        this.userMemberRequests = groups;
    })
    
    GroupSvc.fetchUserSuggested()
        .then((groups) => {
        this.userSuggested = groups;
    })
    
    
    this.selectGroup = (group) => {
        this.currentGroup = group;
        PlaylistSvc.fetchAll(group._id).then((playlists) => {
            this.playlists = playlists;
        });
        SongSvc.fetchAll(group._id).then((songs) => {
            this.allSongs = this.songs = songs;
        });
    }
    
    this.addGroup = (group) => {
        GroupSvc.add(group)
        .then((response) => {
            this.userGroups.push(response);
            this.group = null;
        });
    }
     
    this.updateGroup = (group) => {
        GroupSvc.update(group)
    }
    
    this.deleteGroup = (group) => {
        GroupSvc.delete(group)
        .then(() => {
            this.userGroups.splice(this.groups.indexOf(group),1);
            this.userSuggested.push(group);
        });
    }
    
    this.requestGroup = (group) => {
        GroupSvc.addMemberRequest(group)
        .then(() => {
            group.requested = true;
        })
    }
    
    this.acceptMember = (group, user, accept) => {
        GroupSvc.acceptMember(group, user, accept)
        .then(() => {
            group.memberRequests.splice(group.memberRequests.indexOf(user), 1);
        })
    }
    
    this.requestGroup = (group) => {
        GroupSvc.addMemberRequest(group)
        .then(() => {
            group.requested = true;
        })
    }
}
GroupCtrl.prototype = {
    get userGroups() {
        return this.groupSvc.userGroups;
    },
    
    set userGroups(userGroups) {
        this.groupSvc.userGroups = userGroups;
    },
}

angular.module('app')
    .controller('GroupCtrl', GroupCtrl);
