const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

module.exports = function (app) {
  const router = express.Router();
  // console.log('App:');
  // const locals = app.locals;
  // console.log(locals);
  // Swagger API Documentation
  const port = app.locals.config.externalPort; //app.locals.config.externalPort;
  const ip = app.locals.config.externalIp; //app.locals.config.externalIp;

  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.3',
      info: {
        title: 'VanillaStack API',
        description:
          'This is a sample API for the communication between Front- and Backend for the VanillaStack',
        termsOfService: 'https://cloudcial.io/terms/',
        contact: {
          email: 'apiteam@cloudical.io',
        },
        license: {
          name: 'Apache 2.0',
          url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
        version: '1.0.0',
      },
      servers: [
        {
          url: `{hostname}:{port}/{basePath}`,
          variables: {
            hostname: {
              default: ip,
            },
            port: {
              default: port,
            },
            basePath: {
              default: 'api/v1/',
            },
          },
        },
      ],

      components: {
        schemas: {
          loadBalancerVirtualIp: {},
          loadBalancerFqdn: {},
          reset: {},
          service_cidr: {},
          podNetCidr: {},
          Node: {
            required: ['host', 'user'],
            type: 'object',
            properties: {
              host: {
                type: 'string',
                example: 'domain.io',
              },
              user: {
                type: 'string',
                example: 'root',
              },
            },
          },
          Nodes: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Node',
            },
          },
          Role: {
            type: 'object',
            properties: {
              role: {
                type: 'string',
                example: 'm',
              },
            },
          },
          NodeWithRole: {
            type: 'object',
            allOf: [
              {
                $ref: '#/components/schemas/Node',
              },
              {
                $ref: '#/components/schemas/Role',
              },
            ],
          },
          NodesWithRole: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/NodeWithRole',
            },
          },
          InternalLB: {
            type: 'object',
            required: ['enabled'],
            properties: {
              enabled: {
                type: 'boolean',
              },
              ip: {
                type: 'string',
              },
              fqdn: {
                type: 'string',
              },
            },
          },
          ExternalLB: {
            type: 'object',
            required: ['enabled'],
            properties: {
              enabled: {
                type: 'boolean',
              },
              ip_fqdn: {
                type: 'string',
              },
              metalLB: {
                type: 'boolean',
              },
            },
          },
          Tag: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
              },
              value: {
                type: 'string',
              },
            },
          },
          Tags: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Tag',
            },
          },
          wsClient: {
            type: 'object',
            required: [],
            properties: {
              uuid: {
                $ref: '#/components/schemas/uuid',
              },
            },
          },
          execResponse: {
            type: 'object',
            properties: {
              transactionId: {
                $ref: '#/components/schemas/transactionId',
              },
            },
          },
          transactionId: {
            type: 'string',
            example: '0000000000',
          },
          info: {
            type: 'object',
            properties: {
              uuid: {
                type: 'string',
                example: '00000000-0000-0000-0000-0000000000000',
              },
              mode: {
                type: 'string',
                example: 'installer',
              },
              version: {
                type: 'string',
                example: '0.500',
              },
              sshPublicKey: {
                type: 'string',
                example:
                  'ssh-rsa KATAKANAAgQCq/3j+skZ6UtW+5u09lHNsj6tQ51s1SPrCBakedNf0Tp0GbMJDyR4e9T04ZZw==',
              },
            },
          },
          uuid: {
            type: 'object',
            properties: {
              uuid: {
                type: 'string',
                example: '00000000-0000-0000-0000-0000000000000',
              },
            },
          },
          Connection: {
            type: 'object',
            required: ['uuid', 'nodes'],
            properties: {
              uuid: {
                type: 'string',
                example: '00000000-0000-0000-0000-0000000000000',
              },
              dry: {
                type: 'boolean',
                example: true,
              },
              nodes: {
                $ref: '#/components/schemas/Nodes',
              },
            },
          },
          Cluster: {
            type: 'object',
            required: [],
            properties: {
              name: {
                type: 'string',
                example: 'cluster',
              },
              ip: {
                type: 'string',
                example: '1.1.1.1',
              },
              fqdn: {
                type: 'string',
                example: 'cluster',
              },
              usefqdn: {
                type: 'boolean',
                example: true,
              },
              adminfqdn: {
                type: 'string',
                example: 'admin.cluster',
              },
              useadminfqdn: {
                type: 'boolean',
                example: true,
              },
              externalLbIp: {
                type: 'boolean',
                example: true,
              },
              useExternalLb: {
                type: 'boolean',
                example: true,
              },
            },
          },
          General: {
            type: 'object',
            required: [],
            properties: {
              installRook: {
                type: 'boolean',
                example: true,
              },
              installCF: {
                type: 'boolean',
                example: true,
              },
              installOS: {
                type: 'boolean',
                example: true,
              },
              harborKey: {
                type: 'string',
                example: '123456',
              },
            },
          },
          Rook: {
            type: 'object',
            required: [],
            properties: {
              dashboard: {
                type: 'boolean',
                example: false,
              },
              monitoring: {
                type: 'boolean',
                example: true,
              },
              replicaLevel: {
                type: 'number',
                example: 3,
              },
            },
          },
          cf: {
            type: 'object',
            required: [],
            properties: {
              dashboard: {
                type: 'boolean',
                example: false,
              },
              monitoring: {
                type: 'boolean',
                example: true,
              },
              replicaLevel: {
                type: 'number',
                example: 3,
              },
            },
          },
          testing: {},
        },
      },
    },
    apis: ['./src/routes/*.js', './src/routes/api/*.js'],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  /* OpenAPI Docu. */
  // router.get('/', function (req, res, next) {
  //     res.send('Hello World');
  // });

  return router;
};
// module.exports = router;
