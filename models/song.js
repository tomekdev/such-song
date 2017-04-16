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
    duration: {
        minutes: {
            type: Number
        },
        seconds: {
            type: Number
        }
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
