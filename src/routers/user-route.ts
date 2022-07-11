import express, { Request, Response } from 'express';
import User from '../models/User';
import * as Joi from 'joi';
import {
    ContainerTypes,
    ValidatedRequest,
    ValidatedRequestSchema,
    createValidator
} from 'express-joi-validation';
import UserService from '../services/user-service';
import { logger } from '../utils/logger';

const userRouter = express.Router();
const validator = createValidator();

const userService = new UserService();

const userSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required().alphanum(),
    age: Joi.number().required().min(4).max(130)
});

interface UserRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login: string,
        password: string,
        age: number
    }
}

userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const { limit, loginSubstring } = req.query;

        if (limit || loginSubstring) {
            res.status(200).json(await userService.getAutoSuggestUsers(loginSubstring as string, limit as string));
        } else {
            const users = await userService.getAllUsers();
            res.status(200).json({ users });
        }
    } catch (error) {
        res.status(500).json({ message: error });
        logger.error(`${req.method} - ${req.url} - Error: ${error}`);
    }
});

userRouter.get('/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const user = await userService.getById(userId);

        if (!user) {
            res.status(404).json({
                message: `User with id ${userId} not found`
            });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ message: error });
        logger.error(`${req.method} - ${req.url} - Error: ${error}`);
    }
});

userRouter.post(
    '/',
    validator.body(userSchema),
    async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
        const userDTO = req.body as User;

        try {
            const user = await userService.createUser(userDTO);

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error });
            logger.error(`${req.method} - ${req.url} - ${JSON.stringify(req.body)} - Error: ${error}`);
        }
    }
);

userRouter.put(
    '/:id',
    validator.body(userSchema),
    async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
        const userId = req.params.id;

        try {
            const user = await userService.getById(userId);

            if (!user) {
                res.status(404).json({
                    message: `User with id ${userId} not found`
                });
            } else {
                const newUser = req.body as User;
                await userService.updateById(userId, newUser);

                const updatedUser = await userService.getById(userId);

                res.status(200).json({ message: 'User successfully updated', user: updatedUser });
            }
        } catch (error) {
            res.status(500).json({ message: error });
            logger.error(`${req.method} - ${req.url} - ${JSON.stringify(req.body)} - Error: ${error}`);
        }
    }
);

userRouter.delete('/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const user = await userService.getById(userId);

        if (!user) {
            res.status(404).json({
                message: `User with id ${userId} not found`
            });
        } else {
            await userService.deleteById(userId);

            res.status(200).json({ message: 'User successfully deleted', user });
        }
    } catch (error) {
        res.status(500).json({ message: error });
        logger.error(`${req.method} - ${req.url} - Error: ${error}`);
    }
});

export default userRouter;
