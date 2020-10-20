const express = require('express');
const router = express.Router();

const connectionRouter = require('./api/connection');
const setupRouter = require('./api/setup');
const kubeConfigRouter = require('./api/kubeconfig');
const inventoryRouter = require('./api/inventory');
const infoRouter = require('./api/info');
const docuRouter = require('./openapi');

router.use('/connection', connectionRouter);
router.use('/setup', setupRouter);
router.use('/config', kubeConfigRouter);
router.use('/inventory', inventoryRouter);
router.use('/info', infoRouter);
router.use('/api-docs', docuRouter);

router.get('/', function (req, res) {
    res.redirect('/api/v1/api-docs');
});

module.exports = router;
