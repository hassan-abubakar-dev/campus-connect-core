import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnection, testConnection } from './config/db.js';
import socketInit from './chat/socket.js';
import setupRelationships from './models/relationship.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

import authRouter from './routes/auth.js'
import chatRouter from './routes/chat.js'

dotenv.config();

const app = express();
const httpServer = http.createServer(app); // Create the HTTP server

// Initialize Socket.io on the HTTP server
socketInit(httpServer);
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



// Basic route
app.get('/', (req, res) => {
    res.send('Server is running and accepting all origins.');
});

// routes
app.use('/api', authRouter);
app.use('/api', chatRouter);

// Database Sync and Server Startup
const PORT = process.env.PORT || 5000;

setupRelationships();

(async () => {
    try {
        await testConnection();
        await dbConnection.sync();
        console.log('Database connected and models synced successfully.');

        // CRITICAL: Start the httpServer, NOT app.listen()
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
    }
})();