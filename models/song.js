var db = require('../db')
var song = db.model('Song', {
    name: {
        type: String,
        required: true
    },
    added: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = song
