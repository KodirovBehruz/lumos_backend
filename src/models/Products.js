import { DataTypes } from 'sequelize'
import sequelize from "./database.js"
import { formatDate } from "../helpers/formatedDateTime.js"


export const SIZE_TYPES = ["circle", "oval", "square"]

export const Products = sequelize.define("Products", {
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
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  sizeType: {
    type: DataTypes.ENUM,
    values: SIZE_TYPES,
    allowNull: false,
  },
  sizes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
})

