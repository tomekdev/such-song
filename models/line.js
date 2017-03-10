var db = require('../db')
var lineSchema = db.Schema({
    text: {
        type: String
    }
})

var line = db.model('line', lineSchema);

module.exports = line
