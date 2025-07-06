import * as ProductsController from '../controllers/products.js'
import express from 'express';
import upload from '../helpers/fileStorage.js';

export const router = express.Router()


router.get('/', ProductsController.getList)
// router.get('/:id', ProductsController.getById)
router.post('/', upload.array('images', 5), ProductsController.create)
router.patch('/:id', ProductsController.updateById)
router.delete('/:id', ProductsController.removeById)
router.get('/discounts', ProductsController.getDiscountList)
router.get('/size_types', ProductsController.getSizeTypesList)
router.get('/also-buy/:slug', ProductsController.getAlsoBuyList)
router.get('/:slug', ProductsController.getBySlug)
