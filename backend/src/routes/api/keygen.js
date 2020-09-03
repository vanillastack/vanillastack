const express = require('express');
const router = express.Router();

/**
 * Generate SSH Object
 * @swagger
 * /keygen:
 *     post:
 *         summary: Generate SSH private and public key-pair
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
router.post('/', function (req, res) {
    res.json({
        message: 'OK'
    });
});

module.exports = router;
