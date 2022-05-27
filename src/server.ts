import express, { Request, Response } from 'express';
import userRouter from './routes/user-route';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use('/user', userRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('App works');
});

app.listen(PORT, () => {
    console.log(`App start on port ${PORT}`);
});
