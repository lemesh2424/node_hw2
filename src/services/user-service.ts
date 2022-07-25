import User from '../models/User';
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

    async getByLogin(login: string): Promise<User> {
        return await this.userDal.getByLogin(login);
    }

    async createUser(user: User): Promise<User> {
        return await this.userDal.createUser(user);
    }

    async updateById(userId: string, newUser: User): Promise<User> {
        return await this.userDal.updateById(userId, newUser);
    }

    async deleteById(userId: string): Promise<User> {
        return await this.userDal.deleteById(userId);
    }

    async getAutoSuggestUsers(loginSubstring = '', limit: string): Promise<User[]> {
        return await this.userDal.getAutoSuggestUsers(loginSubstring, limit);
    }
}
