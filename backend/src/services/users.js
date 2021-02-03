const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const proc = require('child_process');

const clients = {};

const createClient = function () {
  const { privateKey, publicKey } = getKeyPair();
  const newClient = uuid.v4();
  clients[newClient] = {
    uuid: newClient,
    privateKey: privateKey,
    sshPublicKey: publicKey,
  };
  return clients[newClient];
};

const getClient = function (uuid) {
  return clients[uuid];
};

const setNewKeyPair = function (uuid) {
  const client = getClient(uuid);
  if (client) {
    const { privateKey, publicKey } = getKeyPair();
    client.privateKey = privateKey;
    client.sshPublicKey = publicKey;
    return client;
  }
};

const getKeyPair = function () {
  const location = '/tmp';
  // console.log(randPassword(4, 4, 8));
  const execOptions = {
    cwd: `${location}`,
    env: null,
  };
  let privateKey;
  let publicKey;
  // ssh-keygen -f 'temp.key' -t rsa -b 2048 -N '' -C "$COMMENT"
  try {
    const comment = 'k8s@cloudical.io';
    proc.execSync(
      `ssh-keygen -f 'temp.key' -t rsa -b 2048 -N '' -C ${comment}`,
      execOptions
    );
    // data = data.toString().split(';_;'); // .replace(/(\r\n|\n|\r)/gm, "").split(';_;');
    try {
      privateKey = fs.readFileSync(path.join(location, 'temp.key'), 'utf8'); // data[1];
      publicKey = fs
        .readFileSync(path.join(location, 'temp.key.pub'), 'utf8')
        .replace(/(\r\n|\n|\r)/gm, ''); // data[2].replace(/(\r\n|\n|\r)/gm, "");
    } catch (e) {
      console.log('Reading KeyPair gone wrong: ', e);
    } finally {
      try {
        fs.unlinkSync(path.join(location, 'temp.key'));
        fs.unlinkSync(path.join(location, 'temp.key.pub'));
      } catch (e) {
        console.log('Cleaning up gone wrong: ', e);
      }
    }
    return { privateKey, publicKey };
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

module.exports = {
  getClient,
  createClient,
  setNewKeyPair,
};
