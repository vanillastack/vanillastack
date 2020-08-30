const express = require('express');
const router = express.Router();
const {createClient, getClient} = require('../../websocket');

/**
 * Get Info Object
 * @swagger
 * /info:
 *     get:
 *         summary: Info Object
 *         requestBody:
 *             description: Node object which connection needs to be tested
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/info"
 *             required: true
 *         responses:
 *             200:
 *                 description: OK
 *                 content:
 *                     text/plain:
 *                         schema:
 *                             type: string
 *                             example: Successfully created clusterName
 *             400:
 *                 description: Bad Request
 *                 content: {}
 *             401:
 *                 description: Unauthorized
 *                 content: {}
 *             408:
 *                 description: Request Timeout
 *                 content: {}
 */
router.get('/', function (req, res, next) {
    const newClient = createClient();
    res.json({
        uuid: newClient.uuid,
        mode: process.env.MODE || 'installer',
        publicKey: ''
    });
});

/**
 * Get Specific Info Object
 * @swagger
 * /info/:uuid:
 *     get:
 *         summary: Info Object
 *         requestBody:
 *             description: Node object which connection needs to be tested
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/Cluster"
 *             required: true
 *         responses:
 *             200:
 *                 description: OK
 *                 content:
 *                     text/plain:
 *                         schema:
 *                             type: string
 *                             example: Successfully created clusterName
 *             400:
 *                 description: Bad Request
 *                 content: {}
 *             401:
 *                 description: Unauthorized
 *                 content: {}
 *             408:
 *                 description: Request Timeout
 *                 content: {}
 */
router.get('/:uuid', function (req, res, next) {
    const client = getClient(req.params.uuid);
    res.json({
        uuid: client.uuid,
        mode: process.env.MODE || 'installer',
        publicKey: ''
    });
});

module.exports = router;
