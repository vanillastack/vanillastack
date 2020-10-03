const express = require('express');
const router = express.Router();
const {getClient} = require('../../websocket');

/**
 * Get Current Ansible Config
 * @swagger
 * /inventory/{uuid}:
 *     get:
 *         summary: Endpoint to get current ansible config for a setup run
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
    const debug = req.app.locals.config.debug;
    if (!client) {
        if (debug) {
            console.log("Client not Found");
        }
        res.status(400).json({
            message: 'uuid invalid'
        });
        return;
    } else if (client.setup == null) {
        if (debug) {
            console.log("Client has not run setup yet");
        }
        res.status(400).json({
            message: 'setup has not run yet'
        });
        return;
    }

    res.status(200).send(
        client.ansibleConfig
    );
});

module.exports = router;
