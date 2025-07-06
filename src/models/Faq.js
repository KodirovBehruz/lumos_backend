import sequelize from './database.js';
import { DataTypes } from 'sequelize';
import { formatedDateTime } from '../helpers/formatedDateTime.js';

export const Faq = sequelize.define("Faq", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
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
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
    createdAt: true,
    updatedAt: false,
})