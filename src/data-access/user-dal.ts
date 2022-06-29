import User from '../models/User';
import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';

export default class UserDAL {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find({
            where: {
                isDeleted: false
            }
        });
    }

    async getById(userId: string): Promise<User> {
        return await this.userRepository.findOneBy({
            id: userId,
            isDeleted: false
        });
    }

    async createUser(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async updateById(userId: string, newUser: User): Promise<User> {
        const userToUpdate = await this.getById(userId);

        Object.assign(userToUpdate, newUser);

        return await this.userRepository.save(userToUpdate);
    }

    async deleteById(userId: string): Promise<User> {
        const userToDelete = await this.getById(userId);

        userToDelete.isDeleted = true;

        return await this.userRepository.softRemove(userToDelete);
    }
}
