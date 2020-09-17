const fs = require('fs');
const path = require('path');

const getVersion = function () {
    try {
        if (fs.existsSync(path.join(__dirname, '../../version'))) {
            return fs.readFileSync(path.join(__dirname, '../../version'), 'utf8');
        } else {
            console.log(`Version File does not exists: ${path.join(__dirname, '../../version')}`);
        }
    } catch (e) {
        console.log(`Reading Version File gone wrong:\n${e}`);
    }
}

const config = {
    ansibleBasePath: process.env.ANSIBLEPATH || '/something/ansible',
    mode: process.env.MODE || 'installer',
    debug: Boolean(process.env.DEBUG || 'false'),
    version: getVersion()
}

module.exports = config;
