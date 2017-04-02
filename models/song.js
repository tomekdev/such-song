var db = require('../db')
require('./line')

var song = db.model('song', {
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
