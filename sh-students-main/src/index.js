import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import configureApp from './config/app.js';
import logger from './config/logger.js';

const app = configureApp(express());

app.listen(app.get('port'), () => {
    logger.info('Server Running');
    logger.info('Node Environment: ' + process.env.NODE_ENV);
    if (process.env.NODE_ENV === "development") {
        logger.info(`Local:            http://localhost:${process.env.PORT}`);
        logger.info(`On Your Network:  http://${process.env.APP_DOMAIN}`);
    }
});
