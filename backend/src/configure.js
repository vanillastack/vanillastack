const express = require('express');
const cookieParser = require('cookie-parser');
const docuRouter = require('./routes/openapi');
const apiRouter = require('./routes/api');

module.exports = app => {
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    
    app.use('/api-docs', docuRouter);
    app.use('/api/v1', apiRouter);
}
