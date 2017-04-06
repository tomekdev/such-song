var db = require('../db')
require('./song')

var playlist = db.model('playlist', {
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
    }]

})

module.exports = playlist
