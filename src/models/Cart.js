import sequelize from './database.js';
import { DataTypes } from 'sequelize';
import { formatDate } from '../helpers/formatedDateTime.js';

export const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        after: "id",
        get() {
            const rawValue = this.getDataValue("createdAt")
            return formatDate(rawValue)
        }
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    timestamps: false,
    createdAt: true,
    updatedAt: false
})
