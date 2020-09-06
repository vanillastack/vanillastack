const express = require('express');
const router = express.Router();

const connectionRouter = require('./api/connection');
const setupRouter = require('./api/setup')
const infoRouter = require('./api/info');

router.use('/connection', connectionRouter);
router.use('/setup', setupRouter);
router.use('/info', infoRouter);

router.get('/', function (req, res) {
    res.send('Hello World');
});

module.exports = router;
