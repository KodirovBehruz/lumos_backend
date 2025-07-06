import sequelize from './database.js';
import { DataTypes } from 'sequelize';
import { Cart } from './Cart.js';
import { Products } from './Products.js';

export const CartProduct = sequelize.define("CartProduct", {
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
})

Cart.belongsToMany(Products, { through: "CartProduct" })
Products.belongsToMany(Cart, { through: "CartProduct" })