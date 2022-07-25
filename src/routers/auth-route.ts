import express, { Response } from 'express';
import * as Joi from 'joi';
import * as jwt from 'jsonwebtoken';
import {
    ContainerTypes,
    ValidatedRequest,
    ValidatedRequestSchema,
    createValidator
} from 'express-joi-validation';
import UserService from '../services/user-service';
import { logger } from '../utils/logger';
import config from '../config';

const authRouter = express.Router();
const validator = createValidator();

const userService = new UserService();

const loginSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required().alphanum()
});

interface LoginRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login: string,
        password: string
    }
}

authRouter.post(
    '/login',
    validator.body(loginSchema),
    async (req: ValidatedRequest<LoginRequestSchema>, res: Response) => {
        try {
            const { login, password } = req.body;

            const user = await userService.getByLogin(login);

            if (!user || user.password !== password) {
                return res.status(400).json({
                    message: 'Invalid credentials'
                });
            }

            const token = jwt.sign(
                { user_id: user.id, login },
                config.tokenKey,
                {
                    expiresIn: '2h'
                }
            );

            return res.status(200).json({ user, token });
        } catch (error) {
            logger.error(`${req.method} - ${req.url} - Error: ${error}`);
            return res.status(500).json({ message: error });
        }
    }
);

export default authRouter;
