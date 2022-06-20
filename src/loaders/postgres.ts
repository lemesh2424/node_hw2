import { Sequelize } from 'sequelize';
import config from '../config';

export default async (): Promise<void> => {
    const sequelize = new Sequelize(config.databaseName, config.databaseUser, config.databasePassword, {
        host: config.databaseHost,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
