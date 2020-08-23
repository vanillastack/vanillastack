const express = require('express');
const router = express.Router();

/**
 * GET users listing
 *
 * @swagger
 */
router.get('/', function(req, res, next) {
  res.json({
    message: 'OK'
  });
});

module.exports = router;
