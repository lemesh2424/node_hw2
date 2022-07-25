import express, { Request, Response } from 'express';
import Group, { Permission } from '../models/Group';
import * as Joi from 'joi';
import {
    ContainerTypes,
    ValidatedRequest,
    ValidatedRequestSchema,
    createValidator
} from 'express-joi-validation';
import GroupService from '../services/group-service';
import { logger } from '../utils/logger';

const groupRouter = express.Router();
const validator = createValidator();

const groupService = new GroupService();

const groupSchema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')).required()
});

interface GroupRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        name: string,
        permissions: Permission[]
    }
}

groupRouter.get('/', async (req: Request, res: Response) => {
    try {
        const groups = await groupService.getAllGroups();

        return res.status(200).json({ groups });
    } catch (error) {
        logger.error(`${req.method} - ${req.url} - Error: ${error}`);
        return res.status(500).json({ message: error });
    }
});

groupRouter.get('/:id', async (req: Request, res: Response) => {
    const groupId = req.params.id;

    try {
        const group = await groupService.getById(groupId);

        if (!group) {
            return res.status(404).json({
                message: `Group with id ${groupId} not found`
            });
        }

        return res.status(200).json(group);
    } catch (error) {
        logger.error(`${req.method} - ${req.url} - Error: ${error}`);
        return res.status(500).json({ message: error });
    }
});

groupRouter.post(
    '/',
    validator.body(groupSchema),
    async (req: ValidatedRequest<GroupRequestSchema>, res: Response) => {
        const groupDTO = req.body as Group;

        try {
            const group = await groupService.createGroup(groupDTO);

            return res.status(200).json(group);
        } catch (error) {
            logger.error(`${req.method} - ${req.url} - ${JSON.stringify(req.body)} - Error: ${error}`);
            return res.status(500).json({ message: error });
        }
    }
);

groupRouter.put(
    '/:id',
    validator.body(groupSchema),
    async (req: ValidatedRequest<GroupRequestSchema>, res: Response) => {
        const groupId = req.params.id;

        try {
            const group = await groupService.getById(groupId);

            if (!group) {
                return res.status(404).json({
                    message: `Group with id ${groupId} not found`
                });
            }

            const newGroup = req.body as Group;
            await groupService.updateById(groupId, newGroup);

            const updatedGroup = await groupService.getById(groupId);

            return res.status(200).json({ message: 'Group successfully updated', group: updatedGroup });
        } catch (error) {
            logger.error(`${req.method} - ${req.url} - ${JSON.stringify(req.body)} - Error: ${error}`);
            return res.status(500).json({ message: error });
        }
    }
);

groupRouter.delete('/:id', async (req: Request, res: Response) => {
    const groupId = req.params.id;

    try {
        const group = await groupService.getById(groupId);

        if (!group) {
            return res.status(404).json({
                message: `Group with id ${groupId} not found`
            });
        }

        await groupService.deleteById(groupId);

        return res.status(200).json({ message: 'Group successfully deleted', group });
    } catch (error) {
        logger.error(`${req.method} - ${req.url} - Error: ${error}`);
        return res.status(500).json({ message: error });
    }
});

groupRouter.post('/:id/add-users', async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const { userIds } = req.body;

    try {
        const group = await groupService.getById(groupId);

        if (!group) {
            return res.status(404).json({
                message: `Group with id ${groupId} not found`
            });
        }

        const groupToAddTo = await groupService.addUsersToGroup(groupId, userIds);

        return res.status(200).json({
            message: `Users added to group with id ${groupId}`,
            group: groupToAddTo
        });
    } catch (error) {
        logger.error(`${req.method} - ${req.url} - Error: ${error}`);
        return res.status(500).json({ message: error });
    }
});

export default groupRouter;
