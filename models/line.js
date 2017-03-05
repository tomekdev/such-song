var db = require('../db')
var lineSchema = db.Schema({
    text: {
        type: String,
        required: true
    }
})

var line = db.model('line', lineSchema);

module.exports = line
