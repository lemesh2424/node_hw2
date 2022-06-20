import { Application, json } from 'express';
import userRouter from '../routers/user-route';

export default async ({ app }: { app: Application }) => {
    app.use(json());
    app.use('/user', userRouter);
};
