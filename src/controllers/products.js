import { Products } from '../models/Products.js';
import { productFilters } from '../helpers/productFilters.js';
import { formatedToSlug } from '../helpers/formatedToSlug.js';
import { Categories } from '../models/Categories.js';
import { Op } from 'sequelize';
import  { SIZE_TYPES } from '../models/Products.js';
import sequelize from '../models/database.js';

export const getList = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        const search = req.query.search || ''
        const offset = (page - 1) * limit

        const filters = productFilters(req.query)

        const { count, rows } = await Products.findAndCountAll({
            limit: limit,
            offset: offset,
            page: page,
            where: {
                ...filters,
                ...(search && { text: { [Op.iLike]: `%${search}%` } })
            },
            include: [
                {
                    model: Categories,
                    as: 'category',
                    attributes: ['id', 'createdAt', 'name', 'slug', 'image']
                }
            ]
        })

        const result = rows.map((product) => ({
            ...product.toJSON(),
            finalPrice: parseFloat(product.price) - (parseFloat(product.price) * (product.discount || 0)) / 100
        }))

        res.json({
            result: {
                data: result,
                meta: {
                    count: count,
                    limit: limit,
                    page: page
                }
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Не удалось получить список товаров",
        })
    }
}

export const getById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(404).json({
                message: "Id товара не указан!"
            })
        }

        const product = await Products.findByPk(id, {
            attributes: { exclude: ['categoryId'] },
            include: [
                {
                    model: Categories,
                    as: "category",
                    attributes: ['id', 'createdAt', 'name', 'slug', 'image']
                }
            ]
        })
        if (!product) {
            return res.status(404).json({
                message: "Товар не найден"
            })
        }
        res.status(200).json(product)

    } catch (error) {
        return res.status(500).json({
            message: "Не удалось получить товар"
        })
    }
}

export const getBySlug = async (req, res) => {
    try {
        const { slug } = req.params
        const product = await Products.findOne({
            where: {slug},
            // attributes: { exclude: ['categoryId'] },
            include: [
                {
                    model: Categories,
                    as: "category",
                    attributes: ['id', 'createdAt', 'name', 'slug', 'image']
                }
            ]
        })
        if (!product) {
            return res.status(404).json({
                message: "Товар не найден!"
            })
        }
        res.status(200).json({
            result: {
                data: product
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

export const create = async (req, res) => {
    const slug = formatedToSlug(req.body.name);
    try {
        const category = await Categories.findByPk(req.body.categoryId);
        if (!category) {
            return res.status(404).json({
                message: "Категория не найдена",
            });
        }

        const sizes = Array.isArray(req.body.sizes)
            ? req.body.sizes
            : typeof req.body.sizes === 'string'
                ? req.body.sizes.split(',').map(size => size.trim())
                : []

        const images = req.files.map((file) => `/uploads/${file.filename}`)
        const product = await Products.create({
            name: req.body.name,
            slug: slug,
            text: req.body.text,
            categoryId: req.body.categoryId,
            sizeType: req.body.sizeType,
            sizes: sizes,
            images: images,
            color: req.body.color,
            price: req.body.price,
            discount: req.body.discount,
            inStock: req.body.inStock,
        });

        const result = await Products.findByPk(product.id, {
            attributes: { exclude: ['categoryId'] },
            include: [
                {
                    model: Categories,
                    as: 'category',
                    attributes: ['id', 'createdAt', 'name', 'slug', 'image'],
                },
            ],
        });

        res.json(result);
    } catch (error) {
        console.error("Создания товара...\n", error);
        return res.status(500).json({
            message: "Не удалось создать товар",
        });
    }
};

export const updateById = async (req, res) => {
    try {
        const slug = formatedToSlug(req.body.name)
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Id товара не указан!"
            })
        }

        const { name, categoryId, sizeType, sizes, images, color, price, inStock } = req.body
        const product = await Products.findByPk(id)
        if (!product) {
            return res.status(404).json({
                message: "Товар не найден"
            })
        }

        product.name = name || product.name
        product.slug = slug || product.slug
        product.categoryId = categoryId || product.categoryId
        product.sizeType = sizeType || product.sizeType
        product.sizes = sizes || product.sizes
        product.images = images || product.images
        product.color = color || product.color
        product.price = price || product.price
        product.inStock = inStock || product.inStock
        await product.save()


        res.json({
            message: "Товар успешно обновлен",
        })

    } catch (error) {
        console.error("Обновление товара...\n", error);
        return res.status(500).json({
            message: "Не удалось обновить товар"
        })
    }
}

export const removeById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Id товара не указан!"
            })
        }

        const product = await Products.findByPk(id)
        if (!product) {
            return res.status(404).json({
                message: "Товар не найден"
            })
        }
        await product.destroy()
        res.json({
            message: "Товар успешно удален",
        })

    } catch (error) {
        return res.status(500).json({
            message: "Не удалось удалить товар"
        })
    }
}

export const getDiscountList = async (req, res) => {
    try {
        const limit = 8
        const where = {
            discount: { [Op.gt]: 0 },
        }
        const { count, rows } = await Products.findAndCountAll({
            limit: limit,
            where: where,
            attributes: { exclude: ['categoryId'] },
            include: [
                {
                    model: Categories,
                    as: 'category',
                    attributes: ['id', 'createdAt', 'name', 'slug', 'image'],
                }
            ]
        })
        res.json({
            result: {
                data: rows,
                meta: {
                    count: count,
                }
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Не удалось получить список скидочных товаров",
        })
    }
}

export const getSizeTypesList = async (req, res) => {
    try {
        res.status(200).json({
            result: {
                data: SIZE_TYPES,
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Не удалось получить список типов размеров" });
    }
}

export const getAlsoBuyList = async (req, res) => {
    try {
        const { slug } = req.params
        const product = await Products.findOne({
            where: {slug},
        })
        if (!product) {
            return res.status(404).json({
                message: "Товар не найден!"
            })
        }
        const { rows, count } = await Products.findAndCountAll({
            where: {
                id: { [Op.ne]: product.id },
                categoryId: { [Op.ne]: product.categoryId },
            },
            // attributes: { exclude: ['categoryId'] },
            include: [
                {
                    model: Categories,
                    as: "category",
                    attributes: ['id', 'createdAt', 'name', 'slug', 'image']
                }
            ],
            limit: 14
        })
        if (rows.length === 0) {
            res.status(404).json({
                message: "Нет рекомендаций"
            })
        }
        res.status(200).json({
            result: {
                data: rows,
                meta: {
                    count: count,
                }
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Не удалось получить список товаров",
        })
    }
}
