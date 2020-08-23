const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const apiRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiRouter);

// Swagger API Documentation
console.log(process.env.NODE_ENV)
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.3",
        info: {
            title: "VanillaStack API",
            description: "This is a sample API for the communication between Front- and Backend for the VanillaStack",
            termsOfService: "https://cloudcial.io/terms/",
            contact: {
                    email: "apiteam@cloudical.io"
                },
            license: {
                name: "Apache 2.0",
                url: "https://www.apache.org/licenses/LICENSE-2.0.html"
            },
            version: "1.0.0"
        },
        servers: [{
            url: "http://localhost:{port}/{basePath}",
            variables: {
                port: {
                    default: process.env.PORT || '3000'
                },
                basePath: {
                    default: "api/v1/"
                }
            }
        }]
    },
    apis: [".routes/*.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
