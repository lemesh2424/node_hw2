import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import loaders from './loaders';
import 'reflect-metadata';
import { logger } from './utils/logger';
import HttpException from './exceptions/HttpException';

async function startServer() {
    const app = express();

    await loaders({ expressApp: app });

    app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
        res.sendStatus(500);
        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        next();
    });

    app.listen(config.port, () => {
        logger.info(`App start on port ${config.port}`);
    });
}

process.on('uncaughtException', (err: Error) => {
    logger.error(err.stack);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error(`Possibly Unhandled Rejection at: Promise - ${promise}, reason - ${reason}`);
});

startServer();
