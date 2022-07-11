import Group from '../models/Group';
import User from '../models/User';
import { DataSource } from 'typeorm';
import config from '../config';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.databaseHost,
    port: config.databasePort,
    username: config.databaseUser,
    password: config.databasePassword,
    database: config.databaseName,
    synchronize: true,
    logging: true,
    entities: [Group, User],
    subscribers: [],
    migrations: []
});
