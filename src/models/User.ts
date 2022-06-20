import { Optional, UUIDV4, Sequelize, DataTypes, Model } from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.databaseURL);

interface UserAttributes {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserInput extends Optional<UserAttributes, 'id'> {}

export default class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: string;
    public login!: string;
    public password!: string;
    public age!: number;
    public isDeleted!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

User.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 4, max: 130 }
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    paranoid: true
});
