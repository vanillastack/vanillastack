const express = require('express');
const router = express.Router();
const path = require('path');
const {getClient, downloadFile, cleanUpPath} = require('../../services/websocket');

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
    } else if (client.ansibleConfig == null) {
        if (debug) {
            console.log("Client has not run setup yet");
        }
        res.status(400).json({
            message: 'setup has not run yet'
        });
        return;
    }

    const filename = 'ansible_vars.json';
    const ansibleConfigPath = downloadFile(client.uuid, filename, JSON.stringify(client.ansibleConfig));

    res.on('finish', () => {
        cleanUpPath(debug, null, ansibleConfigPath, [filename]);
    });
    res.download(path.join(ansibleConfigPath, filename));
});

module.exports = router;
