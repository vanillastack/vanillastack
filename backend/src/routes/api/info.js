const express = require('express');
const router = express.Router();
const {createClient, getClient, writeHosts} = require('../../websocket');

/**
 * Get Info Object
 * @swagger
 * /info:
 *     get:
 *         summary: Info Object
 *         requestBody:
 *             description: Node object which connection needs to be tested
 *             content: {}
 *             required: false
 *         responses:
 *             200:
 *                 description: OK
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: "#/components/schemas/info"
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
router.get('/', function (req, res) {
    const newClient = createClient();
    writeHosts('info:');
    res.json({
        uuid: newClient.uuid,
        mode: process.env.MODE || 'installer',
        sshPublicKey: newClient.sshPublicKey
    });
});

/**
 * Get Specific Info Object
 * @swagger
 * /info/{uuid}:
 *     get:
 *         summary: Info Object
 *         parameters:
 *             - name: "uuid"
 *               in: "path"
 *               description: "Client ID"
 *               required: true
 *               type: "string"
 *         responses:
 *             200:
 *                 description: OK
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: "#/components/schemas/info"
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
router.get('/:uuid', function (req, res) {

    const client = getClient(req.params.uuid);
    if (!client) {
        console.log("Not Found");
        res.status(400).json({
            message: 'uuid invalid'
        });
        return;
    }
    res.json({
        uuid: client.uuid,
        mode: process.env.MODE || 'installer',
        publicKey: client.publicKey
    });
});


module.exports = router;
