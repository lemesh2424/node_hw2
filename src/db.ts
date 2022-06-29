import { Chance } from 'chance';

import postgresLoader from './loaders/postgres';
import User from './models/User';
import { AppDataSource } from './data-source';

const dbCreate = async () => {
    const chance = new Chance();

    try {
        await postgresLoader();

        for (let i = 0; i < 100; i++) {
            const user = new User();

            user.login = chance.email();
            user.password = chance.word({ length: 8 });
            user.age = Math.floor(Math.random() * (131 - 4)) + 4;

            await AppDataSource.manager.save(user);
        }
    } catch (error) {
        console.error('Unable to create table User in database:', error);
    }
};

dbCreate();
