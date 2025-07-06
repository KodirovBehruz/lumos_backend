import { Op } from 'sequelize';

export const productFilters = (query) =>  {
    const { minPrice, maxPrice, sizeType, inStock, discount, category } = query
    const filters = {}

    if (minPrice || maxPrice) {
        filters.price = {}
        if (minPrice) filters.price[Op.gte] = parseFloat(minPrice)
        if (maxPrice) filters.price[Op.lte] = parseFloat(maxPrice)
    }

    if (sizeType) {
        filters.sizeType = {
            [Op.in]: sizeType.split(",")
        }
    }

    if (inStock) {
        filters.inStock = inStock === "true"
    }

    if (discount !== undefined) {
        filters.discount = discount === "true" ? { [Op.gt]: 0 } : undefined;
    }

    if (category) {
        filters.categoryId = category
    }


    return filters
}