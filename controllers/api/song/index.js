var router = require('express').Router({mergeParams: true})

router.use(require('./lines'))

module.exports = router
