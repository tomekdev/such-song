var db = require('../db')
var song = db.model('Song', {
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
    },
    added: {
        type: Date,
        required: true,
        default: Date.now
    },
    lyrics: [{
        type: db.Schema.Types.ObjectId,
        ref: 'line'
    }]

})

module.exports = song
