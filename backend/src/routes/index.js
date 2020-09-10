const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.redirect('/api/v1/api-docs');
});

module.exports = router;
