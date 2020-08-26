const express = require('express');
const router = express.Router();

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
 *                      $ref: "#/components/schemas/Node"
 *          required: true
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Successfully connected to hostname
 *          401:
 *              description: Unauthorized
 *              content: {}
 *          408:
 *              description: Request Timeout
 *              content: {}
 */
router.post('/', function (req, res, next) {
    res.status(200).json({
        message: 'OK'
    });
});

module.exports = router;
