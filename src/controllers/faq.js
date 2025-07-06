import { Faq } from '../models/Faq.js';


export const getList = async (req, res) => {
    try {
        const { rows, count } = await Faq.findAndCountAll()
        res.json({
            result: {
                data: rows,
                meta: {
                    count: count
                }
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Не удалось получить список faq"
        })
    }
}

export const getById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Id faq не указан!"
            })
        }
        const faq = await Faq.findByPk(id)
        if (!faq) {
            return res.status(404).json({
                message: "faq не найден"
            })
        }
        res.json(faq)
    } catch (error) {
        return res.status(500).json({
            message: "Не удалось получить faq"
        })
    }
}

export const create = async (req, res) => {
    try {
        const faq = new Faq({
            question: req.body.question,
            answer: req.body.answer,
        })
        const result = await faq.save()
        res.json(result)
    } catch (error) {
        return res.status(500).json({
            message: "Не удалось создать faq",
        })
    }
}

export const updateById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Id faq не указан!"
            })
        }

        const { question, answer } = req.body
        const faq = await Faq.findByPk(id)
        if (!faq) {
            return res.status(404).json({
                message: "Faq не найден"
            })
        }

        faq.question = question || faq.question
        faq.answer = answer || faq.answer
        await faq.save()
        res.json({
            message: "Faq успешно обновлен",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Не удалось обновить faq"
        })
    }
}

export const removeById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Id faq не указан!"
            })
        }

        const faq = await Faq.findByPk(id)
        if (!faq) {
            return res.status(404).json({
                message: "Faq не найден"
            })
        }
        await faq.destroy()
        res.json({
            message: "Faq успешно удален",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Не удалось удалить faq"
        })
    }
}
