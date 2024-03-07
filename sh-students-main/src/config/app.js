import dotenv from "dotenv";
dotenv.config();
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import ip from 'ip';
import { routes } from '../routes/index.js';
import { HttpStatusCode } from '../const/statusCode.js';
import { env } from "./env.js";

const getApiVersion = () => {
    const version = env.VERSION ?? 1;
    return `V${version}`;
}

const configureApp = (app) => {

    // settings
    app.set('port', env.PORT || 5000);
    if (env.NODE_ENV === "development")
        env.APP_DOMAIN = ip.address() + ":" + env.PORT;

    // middlewares
    app.use(morgan("short"));
    app.use(cors());
    app.use(express.json());

    // routes
    app.get('/', (_, res) => {
        res.status(HttpStatusCode.OK).json({
            message: `Student validation service - Segundo Hogar`,
            version: getApiVersion()
        });
    });

    app.use(`/api/${getApiVersion()}/student`, routes.studentRoutes);

    return app;
}

export default configureApp;
