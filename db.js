var mongoose = require('mongoose')
var config = require('./config')

var url = config.DB_URL || 'mongodb://localhost/such-song'

mongoose.connect(url, function () {
  console.log('Connected to MongoDB@%s', url);
})
module.exports = mongoose
