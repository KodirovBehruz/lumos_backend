import { Reviews } from "../models/Reviews.js"
import { Users } from '../models/Users.js';

export const getList = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        const offset = (page - 1) * limit

        const { count, rows } = await Reviews.findAndCountAll({
            limit: limit,
            offset: offset,
            attributes: { exclude: ['userId'] },
            include: [
                {
                    model: Users,
                    as: 'author',
                    attributes: ['username', 'email', 'phoneNumber'],
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
            message: "Не удалось получить список отзывов"
        })
    }
}

export const getById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Id отзыва не указан!"
            })
        }
        const review = await Reviews.findByPk(id, {
            attributes: { exclude: ['userId'] },
            include: [
                {
                    model: Users,
                    as: "author",
                    attributes: ['username', 'email', 'phoneNumber'],
                }
            ]
        })
        if (!review) {
            return res.status(404).json({
                message: "Отзыв не найден"
            })
        }
        res.json(review)
    } catch (error) {
        return res.status(500).json({
            message: "Не удалось получить отзыв"
        })
    }
}

export const create = async (req, res) => {
    try {
        const review = await Reviews.create({
            text: req.body.text,
            userId: req.body.userId
        })
        const result = await Reviews.findByPk(review.id, {
            attributes: { exclude: ['userId'] },
            include: [
                {
                    model: Users,
                    as: 'author',
                    attributes: ['username', 'email', 'phoneNumber'],
                }
            ]
        })
        res.status(201).json(result)

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Не удалось оставить отзыв",
        })
    }
}

export const updateById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Id отзыва не указан!"
            })
        }

        const { text, userId } = req.body
        const review = await Reviews.findByPk(id)
        if (!review) {
            return res.status(404).json({
                message: "Отзыв не найден"
            })
        }

        review.text = text || review.text
        review.userId = userId || review.userId
        await review.save()

        res.status(200).json({
            message: "Отзыв успешно обновлен",
        })

    } catch (error) {
        return res.status(500).json({
            message: "Не удалось обновить отзыв"
        })
    }
}

export const removeById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Id отзыва не указан!"
            })
        }

        const review = await Reviews.findByPk(id)
        if (!review) {
            return res.status(404).json({
                message: "Отзыв не найден"
            })
        }
        await review.destroy()
        res.json({
            message: "Отзыв успешно удален",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Не удалось удалить отзыв"
        })
    }
}