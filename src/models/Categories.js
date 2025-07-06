import { DataTypes } from 'sequelize';
import sequelize from './database.js';
import { formatDate } from '../helpers/formatedDateTime.js';

export const Categories = sequelize.define("Categories", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  }

}, {
    timestamps: false,
    createdAt: true,
    updatedAt: false
})
