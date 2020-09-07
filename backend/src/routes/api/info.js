const express = require('express');
const router = express.Router();
const {createClient, getClient, setNewKeyPair} = require('../../websocket');

/**
 * Get Info Object
 * @swagger
 * /info:
 *     get:
 *         summary: Object with basic user and runtime info
 *         responses:
 *             200:
 *                 description: Ok
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
    // writeHosts('info:');
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
 *         summary: Object with basic user and runtime info of a specific client
 *         parameters:
 *             - name: "uuid"
 *               in: "path"
 *               description: "Client ID"
 *               required: true
 *               type: "string"
 *         responses:
 *             200:
 *                 description: Ok
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
 *
 *
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
        sshPublicKey: client.sshPublicKey
    });
});

// todo: client crud operations needs refactoring
/**
 * Generate new SSH KeyPair
 * @swagger
 * /info:
 *     post:
 *         summary: Regenerate SSH-Keypair for specific Client
 *         requestBody:
 *             description: Node object which connection needs to be tested
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/uuid"
 *             required: true
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
router.post('/', function (req, res) {
    const client = setNewKeyPair(req.body.uuid);
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
        sshPublicKey: client.sshPublicKey
    });
});


module.exports = router;
