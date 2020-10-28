const express = require('express');
const router = express.Router();
const path = require('path');
const {getClient, downloadFile, cleanUpPath} = require('../../services/websocket');

/**
 * Get KubeConfig to Download
 * @swagger
 * /config/{uuid}:
 *     get:
 *         summary: Endpoint to download KubeConfig after successful setup run
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
    const filename = 'kubeconfig';
    const kubeConfigPath = downloadFile(client.uuid, filename, client.setup);
    res.on('finish', () => {
        cleanUpPath(debug, null, kubeConfigPath, [filename]);
    });
    res.download(path.join(kubeConfigPath, filename));
    // res.end();

    //cleanUpPath(null, kubeConfigPath, ['kubeconfig']);
});

module.exports = router;
