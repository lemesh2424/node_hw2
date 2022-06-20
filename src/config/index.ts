import { config } from 'dotenv';

config();

export default {
    port: process.env.PORT,
    databaseName: process.env.DATABASE_NAME,
    databaseUser: process.env.DATABASE_USER,
    databasePassword: process.env.DATABASE_PASSWORD,
    databaseHost: process.env.DATABASE_HOST,
    databaseURL: process.env.DATABASE_URI
};
