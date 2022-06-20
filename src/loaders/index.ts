import expressLoader from './express';
import postgresLoader from './postgres';

export default async ({ expressApp }) => {
    await postgresLoader();
    console.log('Postgres initialized');

    await expressLoader({ app: expressApp });
    console.log('Express initialized');
};
