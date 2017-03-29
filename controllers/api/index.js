var router = require('express').Router()
var bodyParser = require('body-parser')

router.use(bodyParser.json())

router.use(require('./users'))
router.use(require('./sessions'))
router.use(require('./songs'))

module.exports = router
