var db = require('../db')
require('./group')

var user = db.model('user', {
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    groups: [{
        type: db.Schema.Types.ObjectId,
        ref: 'group'
    }]

})

module.exports = user

