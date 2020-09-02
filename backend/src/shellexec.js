const proc = require('child_process');
const {sendMessage} = require('./websocket');

const exec_options = {
    cwd: '/usr/workdir/src',
    env: null
}
const getKeyPair = function () {
    try {
        let data = proc.execSync("sh keygen.sh", exec_options);
        data = data.toString().replace(/(\r\n|\n|\r)/gm, "").split(';_;');
        const privateKey = data[1];
        const publicKey = data[2];
        return {privateKey, publicKey};
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

const connectionCheck = function (transactionId, wsClient) {
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

    // const ans = proc.spawn('ansible-playbook', ['test-playbook.yaml', '-e host=localhost'], spawnOptions);
    const ans = proc.spawn('ls', ['-lha'], spawnOptions);

    ans.stdout.on('data', stdout => {
        // console.log(stdout.toString());
        wsMsg.event = 'EXECUTION';
        wsMsg.payload = stdout.toString();
        sendMessage(wsMsg, wsClient);
    });
    ans.stderr.on('data', stderr => {
        // console.log(stderr.toString());
        wsMsg.event = 'EXECUTION';
        wsMsg.payload = stderr.toString();
        sendMessage(wsMsg, wsClient);
    });
    ans.on('close', code => {
        console.log(`${wsMsg.transactionId}: Return Code: ${code}`);
        wsMsg.event = 'DONE';
        wsMsg.payload = 'Execution completed';
        sendMessage(wsMsg, wsClient);
    });
};

module.exports = {getKeyPair, connectionCheck};
