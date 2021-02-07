const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const config = require('./config/config');

const cors = require('cors');

const app = express();
app.locals.config = config;
// const keycloak = require('./config/keycloakConfig').initKeycloak();
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api')(app);

app.use(cors());
app.disable('x-powered-by');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// app.use(keycloak.middleware());
app.use('/', indexRouter);
app.use('/api/v1', apiRouter);

module.exports = app;
