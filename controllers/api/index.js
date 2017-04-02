var router = require('express').Router()
var bodyParser = require('body-parser')

router.use(bodyParser.json())

router.use(require('./users'))
router.use(require('./sessions'))

router.use(function(req, res, next) {
  if (!req.auth) {
      res.sendStatus(401);
  }
    else {
        next();
    }
});

router.use(require('./songs'))
router.use(require('./groups'))

module.exports = router
