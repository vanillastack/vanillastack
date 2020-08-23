const express = require('express');
const router = express.Router();
const connectionRouter = require('../api/connection')

router.use('/connection', connectionRouter)
/**
 * GET home page
 */
router.get('/', function (req, res, next) {
  res.send('Hello World!');
});

module.exports = router;
