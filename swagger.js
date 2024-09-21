const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path')

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Shop API',
        version: '1.0.0',
        description: 'Shop is a node.js app, for the Shop frontend Angular app.',
    },
};

const options = {
    swaggerDefinition,
    apis: ['shop-server/routes/*.js', 'shop-server/controllers/*.js'], // Path to the API routes in your Node.js application,
    //apis: [path.join(process.cwd(), '/routes/*.routes.js')],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;