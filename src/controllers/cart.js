import { Cart } from '../models/Cart.js';
import { CartProduct } from '../models/CartProduct.js';
import { Products } from '../models/Products.js';
import { Op } from 'sequelize';


export const getCart = async (req, res) => {
    const userId = req.user.id
    const cart = await Cart.findOne({
        where: { userId },
        include: {
            model: Products,
            through: { attributes: ['quantity'] }
        }
    })
    if (!cart) {
        return res.status(200).json({ message: "Корзина пуста", products: [] })
    }
    const totalPrice = cart.Products.reduce((sum, product) => {
        const totalPrice = parseFloat(product.price) - (parseFloat(product.price) * (product.discount || 0)) / 100
        return sum + totalPrice * product.CartProduct.quantity;
    }, 0)
    const result = cart.Products.map((product) => ({
        ...product.toJSON(),
        finalPrice: parseFloat(product.price) - (parseFloat(product.price) * (product.discount || 0)) / 100
    }))
    res.status(200).json({
        result: {
            data: result,
            meta: {
                totalPrice: totalPrice
            }
        }
    })
}

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        const userId = req.user.id

        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId });
        }

        const cartProduct = await CartProduct.findOne({
            where: { CartId: cart.id, ProductId: productId }
        });

        if (cartProduct) {
            cartProduct.quantity += quantity;
            await cartProduct.save();
        } else {
            await CartProduct.create({ CartId: cart.id, ProductId: productId, quantity });
        }

        res.status(200).json({
            message: "Товар успешно добавлен в корзину"
        });
    } catch (error) {
        console.log("Добавления в корзину...\n", error);
        return res.status(500).json({
            message: "Не удалось добавить товар в корзину",
        })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params
        const userId = req.user.id
        const cart = await Cart.findOne({ where: { userId } })
        if (!cart) {
            return res.status(404).json({ message: "Корзина не найдена" });
        }
        const cartProduct = await CartProduct.findOne({
            where: { CartId: cart.id, ProductId: productId }
        })
        if (!cartProduct) {
            return res.status(404).json({ message: "Товар не найден в корзине" });
        }
        await cartProduct.destroy();
        return res.status(200).json({ message: "Товар успешно удалён из корзины" })
    } catch (error) {
        console.log("Удаление из корзины...\n", error);
        return res.status(500).json({
            message: "Не удалось удалить товар из корзины",
        })
    }
}

export const updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, productId, newQuantity } = req.body;
        const cart = await Cart.findOne({ where: { userId } })
        const cartProduct = await CartProduct.findOne({
            where: { CartId: cart.id, ProductId: productId }
        })
        if (!cartProduct) {
            return res.status(404).json({ message: "Товар не найден в корзине" });
        }
        if (newQuantity <= 0) {
            await cartProduct.destroy()
        } else {
            cartProduct.quantity = newQuantity
            await cartProduct.save();
            return res.status(200).json({ message: "Количество товара успешно обнолвенно" })
        }
    } catch (error) {
        console.log("Обноыление значение корзины...\n", error);
        return res.status(500).json({
            message: "Не удалось удалить товар из корзины",
        })
    }
}

export const addAll = async (req, res) => {
    try {
        const { userId, products } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "userId обязателен" })
        }
        let cart = await Cart.findOne({ where: { userId } })
        if (!cart) {
            cart = await Cart.create({ userId })
        }
        let productAdd = products
        if (!products || !Array.isArray(products) || products.length === 0) {
            productAdd = await Products.findAll({
                attributes: ['id'],
            })
            productAdd = productAdd.map((product) => ({
                id: product.id,
                quantity: 1,
            }))
        }

        for (const { id, quantity } of productAdd) {
            const cartProduct = await CartProduct.findOne({
                where: { CartId: cart.id, ProductId: id }
            })
            if (cartProduct) {
                cartProduct.quantity += quantity
                await cartProduct.save()
            } else {
                await CartProduct.create({ CartId: cart.id, ProductId: id, quantity })
            }
        }
        res.status(200).json({
            message: "Товары успешно добавлены в корзину"
        });
    } catch (error) {
        console.log("Ошибка при добавлении в корзину...\n", error);
        return res.status(500).json({
            message: "Не удалось добавить товары в корзину",
        });
    }
}

export const removeAll = async (req, res) => {
    try {
        const { userId, productIds } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId обязателен" });
        }

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: "Корзина не найдена" });
        }

        if (!Array.isArray(productIds) || productIds.length === 0) {
            await CartProduct.destroy({ where: { CartId: cart.id } });
            return res.status(200).json({ message: "Все товары удалены из корзины" });
        }
        if (Array.isArray(productIds) && productIds.length > 0) {
            await CartProduct.destroy({ where: {
                    CartId: cart.id,
                    ProductId: { [Op.in]: productIds }
                }
            })
            return res.status(200).json({ message: "Выбранные товары удалены из корзины" });
        }
    } catch (error) {
        console.error("Ошибка удаления товаров из корзины: ", error);
        return res.status(500).json({ message: "Не удалось удалить товары" });
    }
};

