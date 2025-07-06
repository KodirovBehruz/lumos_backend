import { Categories } from './Categories.js';
import { Products } from './Products.js';
import { Reviews } from './Reviews.js';
import { Users } from "./Users.js"
import { Cart } from './Cart.js';

export function setupAssociations() {
    Categories.hasMany(Products, { foreignKey: 'categoryId', as: 'products' })
    Products.belongsTo(Categories, { foreignKey: 'categoryId', as: 'category' })
    Users.hasMany(Reviews, { foreignKey: 'userId', as: 'reviews' })
    Reviews.belongsTo(Users, { foreignKey: 'userId', as: 'author' })
    Users.hasMany(Cart, { foreignKey: "userId" })
    Cart.belongsTo(Users, { foreignKey: "userId" })

}
