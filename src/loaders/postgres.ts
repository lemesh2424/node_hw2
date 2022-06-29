import { AppDataSource } from '../data-source';

export default async () => {
    try {
        await AppDataSource.initialize();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
