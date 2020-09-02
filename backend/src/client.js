const uuid = require('uuid');
const {getKeyPair} = require('./shellexec');

const clients = {};

const createClient = function () {
    const {privateKey, publicKey} = getKeyPair();
    const newClient = uuid.v4();
    clients[newClient] = {
        uuid: newClient,
        privateKey: privateKey,
        sshPublicKey: publicKey
    };
    return clients[newClient];
}

const getClient = function (uuid) {
    return clients[uuid];
};

module.exports = {createClient, getClient};
