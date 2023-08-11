const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        // openapi: '3.0.0',
        swagger: '2.0',
      info: {
        title: 'API Docs',
        version: '1.0.0',
      },
    //   components: {
    //     securitySchemas: {
    //         bearerAuth: {
    //             type: "http",
    //             scheme: "bearer",
    //             bearerFormat: "JWT"
    //         },
    //     },
    //   },
    //   security: [
    //     {
    //         bearerAuth: [],
    //     }
    //   ]
    },
    apis: ['../routes/*.js'], // files containing annotations as above
  };

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  console.log(swaggerDocs);

module.exports = swaggerDocs;

