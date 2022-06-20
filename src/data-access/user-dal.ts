import User, { UserInput } from '../models/User';

export default class UserDAL {
    async findAll(): Promise<User[]> {
        return await User.findAll();
    }

    async getById(userId: string): Promise<User> {
        return await User.findByPk(userId);
    }

    async createUser(user: UserInput): Promise<User> {
        return await User.create(user);
    }

    async updateById(userId: string, newUser: UserInput): Promise<[affectedCount: number]> {
        return await User.update({ ...newUser }, {
            where: {
                id: userId
            }
        });
    }

    async deleteById(userId: string): Promise<number> {
        try {
            await User.update({ isDeleted: true }, {
                where: {
                    id: userId
                }
            });

            return await User.destroy({
                where: {
                    id: userId
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
}
