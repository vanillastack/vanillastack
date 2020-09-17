const config = {
    ansibleBasePath: process.env.ANSIBLEPATH || '/something/ansible',
    mode: process.env.MODE || 'installer',
    debug: Boolean(process.env.DEBUG || 'false')
}

module.exports = config;
