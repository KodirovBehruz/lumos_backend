import sequelize from './database.js';
import { DataTypes } from 'sequelize';
import { formatedDateTime } from '../helpers/formatedDateTime.js';
import { Cart } from './Cart.js';

export const Users = sequelize.define("Users", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        after: null
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        after: "id",
        get() {
            const rawValue = this.getDataValue("createdAt")
            return formatedDateTime(rawValue)
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Неккоректный формат email',
            },
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            is: /^[+]*[0-9]{10,15}$/
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 100],
                msg: "Пароль должен содержать минимум 8 символов"
            }
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "client",
        validate: {
            isIn: [['admin', 'manager', 'staff', 'client']]
        }
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false,
    createdAt: true,
    updatedAt: false
})
