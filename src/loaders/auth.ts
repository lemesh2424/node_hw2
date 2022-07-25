import { Application, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import { logger } from '../utils/logger';

export default async ({ app }: { app: Application }) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        const AUTH_URL = '/auth/login';

        if (req.url === AUTH_URL) {
            return next();
        }

        const TOKEN_HEADER = 'x-access-token';

        const token = req.body?.token || req.query?.token || req.headers[TOKEN_HEADER];

        if (!token) {
            logger.info(`${req.method} - ${req.url}: Unauthorized Error`);
            return res.sendStatus(401);
        }

        try {
            const decodedUser = jwt.verify(token, config.tokenKey);
            Object.assign(req, { user: decodedUser });
        } catch (error) {
            logger.info(`${req.method} - ${req.url}: Forbidden Error`);
            return res.sendStatus(403);
        }

        return next();
    });
};
