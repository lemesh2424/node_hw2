import { Application, Request, Response, json, NextFunction } from 'express';
import { logger } from '../utils/logger';
import groupRouter from '../routers/group-route';
import userRouter from '../routers/user-route';
import cors from 'cors';
import authRouter from '../routers/auth-route';

export default async ({ app }: { app: Application }) => {
    app.use(json());
    app.use(cors());

    app.use((req: Request, res: Response, next: NextFunction) => {
        logger.info(`${req.method} - ${req.url}`);
        next();
    });

    app.use('/user', userRouter);
    app.use('/group', groupRouter);
    app.use('/auth', authRouter);
};
