const express = require('express');
const session = require('express-session');

module.exports = function (app) {
  const router = express.Router();

  const memoryStore = new session.MemoryStore();
  router.use(
    session({
      secret: 'some secret',
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );
  const keycloak = require('../config/keycloakConfig').initKeycloak(
    memoryStore
  );

  router.use(keycloak.middleware());

  const connectionRouter = require('./api/connection');
  const setupRouter = require('./api/setup');
  const kubeConfigRouter = require('./api/kubeconfig');
  const inventoryRouter = require('./api/inventory');
  const infoRouter = require('./api/info');
  const docuRouter = require('./openapi')(app);
  // const authMiddleware = require('./auth');

  router.use('/connection', connectionRouter);
  router.use('/setup', setupRouter);
  router.use('/config', kubeConfigRouter);
  router.use('/inventory', inventoryRouter);
  router.use('/info', infoRouter);
  router.use('/api-docs', docuRouter);

  router.get('/', function (req, res) {
    res.redirect('/api/v1/api-docs');
  });

  return router;
};
// module.exports = router;
