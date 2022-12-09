import express from 'express';
import http from 'http';
import mongoose from 'mongoose';

import { config } from './config/config';
import receiptRoutes from './routes/Receipt';
const router = express();

// ! connect to mongodb
mongoose
    .connect(config.mongo.url, {
        retryWrites: true,
        w: 'majority'
    })
    .then(() => {
        console.log('Connected to DB');
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
            console.log(`Incoming connection -> Method : [${req.method}] - Url : [${req.url}] - IP : [${req.socket.remoteAddress}] - Status : [${res.statusCode}]`);
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

    router.use('/receipts', receiptRoutes);

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
