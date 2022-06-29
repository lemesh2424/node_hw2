import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, DeleteDateColumn } from 'typeorm';
import Group from './Group';

@Entity()
export default class User {
    @PrimaryGeneratedColumn('uuid')
        id: string;

    @Column('text')
        login: string;

    @Column('text')
        password: string;

    @Column('int')
        age: number;

    @Column({ type: 'boolean', default: false })
        isDeleted: boolean;

    @DeleteDateColumn()
        deletedAt?: Date;

    @ManyToMany(() => Group, (group) => group.users)
        groups: Group[];
}
