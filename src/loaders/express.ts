import { Application, json } from 'express';
import groupRouter from '../routers/group-route';
import userRouter from '../routers/user-route';

export default async ({ app }: { app: Application }) => {
    app.use(json());
    app.use('/user', userRouter);
    app.use('/group', groupRouter);
};
