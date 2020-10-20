const fs = require('fs');
const path = require('path');

const getVersion = function () {
    try {
        const versionPath = path.join(__dirname, '../../version');
        if (fs.existsSync(versionPath)) {
            return fs.readFileSync(versionPath, 'utf8').replace(/(\r\n|\n|\r)/gm, "");
        } else {
            console.log(`Version File does not exists: ${versionPath}`);
        }
    } catch (e) {
        console.log(`Reading Version File gone wrong:\n${e}`);
    }
}

const currentVersion = getVersion();


const config = {
    ansibleBasePath: process.env.ANSIBLEPATH || '/tmp/ansible',
    mode: process.env.MODE || 'installer',
    debug: JSON.parse(process.env.DEBUG || 'false'),
    version: currentVersion
}

module.exports = config;
