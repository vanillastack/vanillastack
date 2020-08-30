const {generateKeyPair, generateKeyPairSync} = require('crypto');

const sshKeyConfig = {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'top secret'
    }
};
// Sync
const {publicKey, privateKey} = generateKeyPairSync('rsa', sshKeyConfig);
// Async
generateKeyPair('rsa', sshKeyConfig, (err, publicKey, privateKey) => {
    console.log()
});
