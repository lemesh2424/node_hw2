import User, { UserInput } from '../models/User';
import UserDAL from '../data-access/user-dal';

export default class UserService {
    userDal: UserDAL;

    constructor() {
        this.userDal = new UserDAL();
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userDal.findAll();
    }

    async getById(userId: string): Promise<User> {
        return await this.userDal.getById(userId);
    }

    async createUser(user: UserInput): Promise<User> {
        return await this.userDal.createUser(user);
    }

    async updateById(userId: string, newUser: UserInput): Promise<[affectedCount: number]> {
        return await this.userDal.updateById(userId, newUser);
    }

    async deleteById(userId: string): Promise<number> {
        return await this.userDal.deleteById(userId);
    }
}
