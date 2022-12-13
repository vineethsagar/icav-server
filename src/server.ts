import express from 'express';
import http from 'http';
import mongoose from 'mongoose';

import { config } from './config/config';
import receiptRoutes, { route } from './routes/Receipt';
import reportRoutes from './routes/Reports';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi, { SwaggerOptions } from 'swagger-ui-express';
import './jobs/generateReports';
const router = express();
// ! Swagger setup
const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ICAV  Receipts API',
            version: '1.0.0',
            description: 'A tiny NodeJS server for Receipts API'
        },
        servers: [
            {
                url: `http://localhost:${config.server.port}`
            }
        ]
    },
    apis: ['./src/routes/*.ts']
};

const specs = swaggerJSDoc(options);

// ! connect to mongodb
mongoose
    .connect(config.mongo.url, {
        retryWrites: true,
        w: 'majority'
    })
    .then(() => {
        console.log('Connected to DB');
        startServer();
    })
    .catch((error) => {
        console.log('Failed to connect to DB : ');
        console.log(error);
    });

//! start server if mongodb connection is successfully

const startServer = () => {
    router.use((req, res, next) => {
        console.log(`Incoming connection -> Method : [${req.method}] - Url : [${req.url}] - IP : [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            console.log(`Operation finished -> Method : [${req.method}] - Url : [${req.url}] - IP : [${req.socket.remoteAddress}] - Status : [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    // ! API rules
    router.use((req, res, next) => {
        //*  * -> req can come from anywhere or can keep ip's
        res.header('Access-Control-Allow-Origin', '*');

        //*  allowed headers
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        //* option that can be used in api
        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    // ! Routes

    router.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
    router.use('/receipts', receiptRoutes);
    router.use('/reports', reportRoutes);

    // ! no route

    router.use((req, res, next) => {
        const error = new Error('Route not found');
        return res.status(404).json({ message: error.message });
    });

    // ! create server
    http.createServer(router).listen(config.server.port, () => {
        console.log(`Server is running on port ${config.server.port}.`);
    });
};
