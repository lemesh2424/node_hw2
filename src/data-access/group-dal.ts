import Group from '../models/Group';
import { AppDataSource } from '../utils/data-source';
import { Repository } from 'typeorm';
import User from '../models/User';
import { logger } from '../utils/logger';

export default class GroupDAL {
    private groupRepository: Repository<Group>;

    constructor() {
        this.groupRepository = AppDataSource.getRepository(Group);
    }

    async findAll(): Promise<Group[]> {
        logger.info('GroupDAL - findAll()');
        return await this.groupRepository.find({
            relations: {
                users: true
            }
        });
    }

    async getById(groupId: string): Promise<Group> {
        logger.info(`GroupDAL - getById(groupId = ${groupId})`);
        return await this.groupRepository.findOneBy({ id: groupId });
    }

    async createGroup(group: Group): Promise<Group> {
        logger.info(`GroupDAL - createGroup(group = ${JSON.stringify(group)})`);
        return await this.groupRepository.save(group);
    }

    async updateById(groupId: string, newGroup: Group): Promise<Group> {
        logger.info(`GroupDAL - updateById(groupId = ${groupId}, newGroup = ${JSON.stringify(newGroup)})`);
        const groupToUpdate = await this.getById(groupId);

        Object.assign(groupToUpdate, newGroup);

        return await this.groupRepository.save(groupToUpdate);
    }

    async deleteById(groupId: string): Promise<Group> {
        logger.info(`GroupDAL - deleteById(groupId = ${groupId})`);
        const groupToDelete = await this.getById(groupId);

        return await this.groupRepository.remove(groupToDelete);
    }

    async addUsersToGroup(groupId: string, userIds: string[]): Promise<Group> {
        logger.info(`GroupDAL - addUsersToGroup(groupId = ${groupId}, userIds = ${userIds})`);
        return await this.groupRepository.manager.transaction(async (transactionalEntityManager) => {
            const groupToAddTo = await transactionalEntityManager.findOneBy(Group, {
                id: groupId
            });

            if (!groupToAddTo.users) {
                groupToAddTo.users = [];
            }

            userIds.forEach(async (userId: string) => {
                const userToAdd = await transactionalEntityManager.findOneBy(User, {
                    id: userId
                });

                groupToAddTo.users.push(userToAdd);
            });

            return await transactionalEntityManager.save(groupToAddTo);
        });
    }
}
