const express = require('express');
const router = express.Router();
const proc = require('child_process');
const {sendMessage, getClient} = require('../../websocket');

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
    const client = getClient(req.body.wsInfo.uuid);
    if (!client) {
        console.log("Not Found");
        res.status(400).json({
            message: 'uuid invalid'
        });
        return;
    }

    const transactionId = genTransactionId();

    execAnsible(transactionId, client);

    res.status(200).json({
        transactionId: transactionId
    });
});

const genTransactionId = function () {
    return Math.floor(Math.random() * (999999999 - 100000000)) + 100000000;
};

const execAnsible = function (transactionId, wsClient) {
    const wsMsg = {
        event: '',
        transactionId: transactionId,
        payload: ''
    }

    const spawnOptions = {
        cwd: '/usr/workdir/src',
        env: null,
        detached: false
    };

    const ans = proc.spawn('ansible-playbook', ['test-playbook.yaml', '-e host=localhost'], spawnOptions);

    ans.stdout.on('data', stdout => {
        console.log(stdout.toString());
        wsMsg.event = 'EXECUTION';
        wsMsg.payload = stdout.toString();
        sendMessage(wsMsg, wsClient);
    });
    ans.stderr.on('data', stderr => {
        console.log(stderr.toString());
        // wsMsg.event = 'EXECUTION';
        // wsMsg.payload = `ERROR:\n${stderr.toString()}`;
        // sendMessage(wsMsg, client);
    });
    ans.on('close', code => {
        console.log(code);
        wsMsg.event = 'DONE';
        wsMsg.payload = 'Execution completed';
        sendMessage(wsMsg, wsClient);
    });
};

module.exports = router;
