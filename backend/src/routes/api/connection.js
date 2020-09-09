const express = require('express');
const router = express.Router();
const {getClient, connectionCheck} = require('../../websocket');

/**
 * POST Connection Check for given Node
 * @swagger
 * /connection:
 *   post:
 *      summary: Test the accessibility to a given Node
 *      requestBody:
 *          description: Node object with connection details
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Connection"
 *          required: true
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/execResponse"
 *          400:
 *              description: Bad Request
 *              content: {}
 *          401:
 *              description: Unauthorized
 *              content: {}
 *          408:
 *              description: Request Timeout
 *              content: {}
 */
// todo: more explicit bad codes
router.post('/', function (req, res) {
    const client = getClient(req.body.uuid);
    const dryRun = req.body.dry;
    const node = req.body.node;
    if (!client) {
        res.status(400).json({
            message: 'uuid invalid'
        });
        return;
    } else if (!node.user) {
        res.status(400).json({
            message: 'user must be specified'
        });
        return;
    } else if (!node.host) {
        res.status(400).json({
            message: 'host must be specified'
        });
        return;
    }

    const transactionId = genTransactionId();

    connectionCheck(transactionId, node, client, dryRun);

    res.status(200).json({
        transactionId: transactionId
    });
});

const genTransactionId = function () {
    return Math.floor(Math.random() * (999999999 - 100000000)) + 100000000;
};

module.exports = router;
