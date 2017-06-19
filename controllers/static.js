var path = require('path')
var express = require('express')
var router  = express.Router()

router.use(express.static(__dirname + '/../assets'))
router.use('/views', express.static(__dirname + '/../views'))
router.use('/resources', express.static(__dirname + '/../resources'))

router.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../templates/app.html'))
})

module.exports = router