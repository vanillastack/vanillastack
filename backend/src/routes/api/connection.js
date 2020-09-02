const express = require('express');
const router = express.Router();
const {getClient, connectionCheck} = require('../../websocket');

/**
 * GET users listing
 * @swagger
 * /connection:
 *   post:
 *      summary: Check connection to existing Nodes
 *      requestBody:
 *          description: Node object which connection needs to be tested
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
 *                      schema: {
 *                          $ref: "#/components/schemas/execResponse"
 *                      }
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
    const client = getClient(req.body.client);
    if (!client) {
        console.log("Not Found");
        res.status(400).json({
            message: 'uuid invalid'
        });
        return;
    }

    const transactionId = genTransactionId();

    connectionCheck(transactionId, client);

    res.status(200).json({
        transactionId: transactionId
    });
});

const genTransactionId = function () {
    return Math.floor(Math.random() * (999999999 - 100000000)) + 100000000;
};

module.exports = router;
