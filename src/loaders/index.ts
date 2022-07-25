import { logger } from '../utils/logger';
import expressLoader from './express';
import postgresLoader from './postgres';
import authLoader from './auth';

export default async ({ expressApp }) => {
    await postgresLoader();
    logger.info('Postgres initialized');

    await authLoader({ app: expressApp });

    await expressLoader({ app: expressApp });
    logger.info('Express initialized');
};
