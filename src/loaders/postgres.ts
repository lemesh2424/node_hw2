import { logger } from '../utils/logger';
import { AppDataSource } from '../utils/data-source';

export default async () => {
    try {
        await AppDataSource.initialize();
        logger.info('Connection has been established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
    }
};
