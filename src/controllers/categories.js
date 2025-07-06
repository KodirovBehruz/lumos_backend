import { Categories } from '../models/Categories.js';
import { formatedToSlug } from '../helpers/formatedToSlug.js';

export const getList = async (req, res) => {
    try {
        const { count, rows } = await Categories.findAndCountAll()
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
            message: "Не удалось получить список категорий",
        })
    }
}

export const create = async (req, res) => {
    const slug = formatedToSlug(req.body.name)
    try {
        const category = new Categories({
         name: req.body.name,
         slug: slug,
         image: req.file ? `/uploads/${req.file.filename}` : null,
        })
        const result = await category.save()
        res.json(result)
    } catch (error) {
        return res.status(500).json({
            message: "Не удалось создать категорию",
        })
    }
}

