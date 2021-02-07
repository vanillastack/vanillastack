// const session = require('express-session');
const Keycloak = require('keycloak-connect');
const config = require('./config');
const fetch = require('node-fetch');

let _keycloak;

// http://localhost:8081/auth/realms/vsmanager
// public_key

const kcConfig = {
  realm: config.realm, //'vsmanager',
  bearerOnly: true,
  clientId: config.clientId, //'vsmanager-backend',
  serverUrl: config.authServerUrl, //'http://localhost:8081/auth',
  // realmPublicKey:
  //   'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiAXJCeEnHy9tshWa90Vj3TPG7CWdsJ/nHJZQA2yPc/OKZKuAT3gNPwEaPb+TuEgUHhvdrG5ggd11QV45GbAgXDLwkhosagrY+n1USMRTWRQJP1VecbkHAJugHBfXg0zYGPoa8Yu8jKyPDa2VnH14/8/wtirZ5+ToXzwdvKzvTsfFMvV+RNCB+lc/puoequrXiRyMiKM/2B0ufiiSoZZAq49SfWP9gbIDmjx8k/INg5eSFiK5BfttjYg6hnpo5vV2+2HWPI/ezFh51wsZyZcccQNOMJAU9cWmAkIQmlDLC04ajbJhvvl960TDjhArapxKZSyHK+G/55oC0BEJeBBL+QIDAQAB',
};

// fetch('http://keycloak:8080/auth/realms/vsmanager')
//   .then((res) => res.json())
//   .then((json) => console.log(json));
//
function initKeycloak(memoryStore) {
  if (_keycloak) {
    console.warn('Trying to init Keycloak again!');
    return _keycloak;
  } else {
    console.log('Initializing Keycloak...');
    // const memoryStore = new session.MemoryStore();
    _keycloak = new Keycloak({ store: memoryStore }, kcConfig);
    return _keycloak;
  }
}

function getKeycloak() {
  if (!_keycloak) {
    console.error(
      'Keycloak has not been initialized. Please called initKeycloak first.'
    );
  }
  return _keycloak;
}

module.exports = {
  initKeycloak,
  getKeycloak,
};
