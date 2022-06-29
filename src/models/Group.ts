import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import User from './User';

export type Permission = 'READ'
    | 'WRITE'
    | 'DELETE'
    | 'SHARE'
    | 'UPLOAD_FILES';

@Entity()
export default class Group {
    @PrimaryGeneratedColumn('uuid')
        id: string;

    @Column('text')
        name: string;

    @Column('simple-array')
        permissions: Permission[];

    @ManyToMany(() => User, (user) => user.groups, {
        cascade: true
    })
    @JoinTable()
        users: User[];
}
