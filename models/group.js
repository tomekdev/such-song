var db = require('../db')
require('./user')
require('./song')
require('./playlist')

var group = db.model('group', {
    name: {
        type: String,
        required: true
    },
    added: {
        type: Date,
        required: true,
        default: Date.now
    },
    songs: [{
        type: db.Schema.Types.ObjectId,
        ref: 'song'
    }],
    playlists: [{
        type: db.Schema.Types.ObjectId,
        ref: 'playlist'
    }],
    memberRequests: [{
        type: db.Schema.Types.ObjectId,
        ref: 'user'
    }]

})

module.exports = group
