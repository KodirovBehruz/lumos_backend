import sequelize from "./database.js"
import { DataTypes } from 'sequelize';
import { formatedDateTime } from '../helpers/formatedDateTime.js';

export const Reviews = sequelize.define("Reviews", {
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
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    }
}, {
    timestamps: false,
    createdAt: true,
    updatedAt: false
})

