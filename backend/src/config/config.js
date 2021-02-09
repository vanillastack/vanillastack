const fs = require('fs');
const path = require('path');

const getVersion = function () {
  try {
    const versionPath = path.join(__dirname, '../../version');
    if (fs.existsSync(versionPath)) {
      return fs.readFileSync(versionPath, 'utf8').replace(/(\r\n|\n|\r)/gm, '');
    } else {
      console.log(`Version File does not exists: ${versionPath}`);
    }
  } catch (e) {
    console.log(`Reading Version File gone wrong:\n${e}`);
  }
};

const currentVersion = getVersion();

const config = {
  ansibleBasePath: process.env.ANSIBLE_PATH || '/tmp/ansible',
  mode: process.env.MODE || 'installer',
  debug: JSON.parse(process.env.DEBUG || 'false'),
  version: currentVersion,
  localPort: process.env.PORT,
  localIp: process.env.IP,
  externalIp: process.env.EXTERNAL_IP,
  externalPort: process.env.EXTERNAL_PORT,
  // Keycloak
  realm: process.env.KEYCLOAK_REALM || 'vsmanager',
  clientId: process.env.KEYCLOAK_CLIENT_ID || 'vsmanager-backend',
  authServerUrl: process.env.KEYCLOAK_URL || 'http://keycloak:8080/auth', // 'http://keycloak:8080/auth' 'http://localhost:8081/auth'
};

module.exports = config;
