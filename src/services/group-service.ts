import Group from '../models/Group';
import GroupDAL from '../data-access/group-dal';

export default class GroupService {
    groupDal: GroupDAL;

    constructor() {
        this.groupDal = new GroupDAL();
    }

    async getAllGroups(): Promise<Group[]> {
        return await this.groupDal.findAll();
    }

    async getById(groupId: string): Promise<Group> {
        return await this.groupDal.getById(groupId);
    }

    async createGroup(group: Group): Promise<Group> {
        return await this.groupDal.createGroup(group);
    }

    async updateById(groupId: string, newGroup: Group): Promise<Group> {
        return await this.groupDal.updateById(groupId, newGroup);
    }

    async deleteById(groupId: string): Promise<Group> {
        return await this.groupDal.deleteById(groupId);
    }

    async addUsersToGroup(groupId: string, userIds: string[]) {
        return await this.groupDal.addUsersToGroup(groupId, userIds);
    }
}
