import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CampusConnect API',
            version: '1.0.0',
            description: 'API documentation for Multi-tenant Campus Chat Application',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
    // This points to your controllers where you will add annotations
    apis: ['./routes/*.js', './controllers/*.js'], 
};

export const swaggerSpec = swaggerJsdoc(options);