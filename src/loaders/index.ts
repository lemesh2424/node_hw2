import { logger } from '../utils/logger';
import expressLoader from './express';
import postgresLoader from './postgres';

export default async ({ expressApp }) => {
    await postgresLoader();
    logger.info('Postgres initialized');

    await expressLoader({ app: expressApp });
    logger.info('Express initialized');
};
