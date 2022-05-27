import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as Joi from 'joi';
import {
    ContainerTypes,
    ValidatedRequest,
    ValidatedRequestSchema,
    createValidator,
    ExpressJoiError
} from 'express-joi-validation';

import { User } from 'src/models/User';

const userRouter = express.Router();
const validator = createValidator();

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

const users: User[] = [];

// Custom Handler for JOI, don't work :( Setting passError option to validator throws error [object Object], but cannot to catch it

// userRouter.use((err: any | ExpressJoiError, req: Request, res: Response, next: NextFunction) => {
//     if (err && err.type in ContainerTypes) {
//         const e: ExpressJoiError = err;

//         res.status(400).json({
//             type: e.type,
//             message: e.error.toString()
//         });
//     }

//     next(err);
// });

userRouter.get('/', (req: Request, res: Response) => {
    const { limit, loginSubstring } = req.query;

    if (limit || loginSubstring) {
        res.status(200).json(getAutoSuggestUsers(loginSubstring as string, limit as string));
    } else {
        res.status(200).json(users);
    }
});

userRouter.get('/:id', (req: Request, res: Response) => {
    const userId = req.params.id;

    const user = findUserById(userId);

    if (!user) {
        res.status(404).json({
            message: `User with id ${userId} not found`
        });
    } else {
        res.status(200).json(user);
    }
});

userRouter.post(
    '/',
    validator.body(userSchema),
    (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
        const user = req.body as User;

        user.id = uuidv4();
        user.isDeleted = false;

        users.push(user);

        res.status(200).json(user);
    }
);

userRouter.put(
    '/:id',
    validator.body(userSchema),
    (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
        const userId = req.params.id;

        const user = findUserById(userId);

        if (!user) {
            res.status(404).json({
                message: `User with id ${userId} not found`
            });
        } else {
            const updatedUser = Object.assign(user, req.body);
            const userToUpdateIndex = users.indexOf(user);

            users.splice(userToUpdateIndex, 1, updatedUser);

            res.status(200).json(updatedUser);
        }
}
);

userRouter.delete('/:id', (req: Request, res: Response) => {
    const userId = req.params.id;

    const user = findUserById(userId);

    if (!user) {
        res.status(404).json({
            message: `User with id ${userId} not found`
        });
    } else {
        const updatedUser = Object.assign(user, { isDeleted: true });
        const userToUpdateIndex = users.indexOf(user);

        users.splice(userToUpdateIndex, 1, updatedUser);

        res.status(200).json(updatedUser);
    }
});

const findUserById = (id: string): User | undefined => {
    const user = users.find((currentUser) => currentUser.id === id);

    return user
        ? user
        : undefined;
};

const getAutoSuggestUsers = (loginSubstring = '', limit: string): User[] => {
    const sortedUsers = users
        .filter((user: User) => {
            if (!loginSubstring) {
                return true;
            }

            return new RegExp(loginSubstring, 'gm').test(user.login);
        })
        .sort((firstUser: User, secondUser: User) => {
            if (firstUser.login.toLowerCase() > secondUser.login.toLowerCase()) {
                return 1;
            } else if (firstUser.login.toLowerCase() < secondUser.login.toLowerCase()) {
                return -1;
            }

            return 0;
        });

    return limit
        ? sortedUsers.slice(0, +limit)
        : sortedUsers;
};

export default userRouter;
