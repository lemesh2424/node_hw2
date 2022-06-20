import { Chance } from 'chance';

import postgresLoader from './loaders/postgres';
import User from './models/User';

const dbCreate = async () => {
    const chance = new Chance();

    await postgresLoader();

    try {
        await User.sync({ alter: true });
        console.log('The table for the User model was just (re)created!');

        for (let i = 0; i < 100; i++) {
            await User.create({
                login: chance.email(),
                password: chance.word({ length: 8 }),
                age: Math.floor(Math.random() * (131 - 4)) + 4
            });
        }
    } catch (error) {
        console.error('Unable to create table User in database:', error);
    }
};

dbCreate();
