import User from '../models/User';
import { AppDataSource } from '../utils/data-source';
import { Repository } from 'typeorm';
import { logger } from '../utils/logger';

export default class UserDAL {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async findAll(): Promise<User[]> {
        logger.info('UserDAL - findAll()');
        return await this.userRepository.find();
    }

    async getById(userId: string): Promise<User> {
        logger.info(`UserDAL - getById(userId = ${userId})`);
        return await this.userRepository.findOneBy({
            id: userId
        });
    }

    async getByLogin(login: string): Promise<User> {
        logger.info(`UserDAL - getByLogin(login = ${login})`);
        return await this.userRepository.findOneBy({
            login
        });
    }

    async createUser(user: User): Promise<User> {
        logger.info(`UserDAL - createUser(user = ${JSON.stringify(user)})`);
        return await this.userRepository.save(user);
    }

    async updateById(userId: string, newUser: User): Promise<User> {
        logger.info(`UserDAL - updateById(userId = ${userId}, newUser = ${JSON.stringify(newUser)})`);
        const userToUpdate = await this.getById(userId);

        Object.assign(userToUpdate, newUser);

        return await this.userRepository.save(userToUpdate);
    }

    async deleteById(userId: string): Promise<User> {
        logger.info(`UserDAL - deleteById(userId = ${userId})`);
        const userToDelete = await this.getById(userId);

        userToDelete.isDeleted = true;

        const deletedUser = await this.userRepository.save(userToDelete);
        return await this.userRepository.softRemove(deletedUser);
    }

    async getAutoSuggestUsers(loginSubstring = '', limit: string): Promise<User[]> {
        logger.info(`UserDAL - getAutoSuggestUsers(loginSubstring = ${loginSubstring}, limit = ${limit})`);
        const users = await this.findAll();

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
    }
}
