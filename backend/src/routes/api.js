const express = require('express');
const router = express.Router();
const {sendMessage, clientArray} = require('../websocket');

const connectionRouter = require('./api/connection');
const setupRouter = require('./api/setup')

router.use('/connection', connectionRouter);
router.use('/setup', setupRouter);

router.get('/', function (req, res, next) {
    res.send('Hello World');
    sendMessage(clientArray[0].uuid, 'Hello World');
});

module.exports = router;
