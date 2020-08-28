const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const indexRouter = require('./routes/index');
const docuRouter = require('./routes/openapi');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log(path.join(__dirname, 'public'));

app.use('/', indexRouter);
app.use('/api-docs', docuRouter);
app.use('/api/v1', apiRouter);

module.exports = app;
