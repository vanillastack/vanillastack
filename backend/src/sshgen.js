const proc = require('child_process');

const exec_options = {
    cwd: '/usr/workdir/src',
    env: null,
}
const getKeyPair = () => {
    try {
        let data = proc.execSync("sh keygen.sh", exec_options);
        data = data.toString().replace(/(\r\n|\n|\r)/gm, "").split(';_;');
        const privateKey = data[1];
        const publicKey = data[2];
        // console.log('PrivateKey: %s', privateKey);
        // console.log('PublicKey: %s', publicKey);
        return {privateKey, publicKey};
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

module.exports = {getKeyPair};
