import * as ReviewsController from '../controllers/reviews.js';
import express from 'express';

export const router = express.Router();

router.get('/', ReviewsController.getList)
router.get('/:id', ReviewsController.getById)
router.post('/', ReviewsController.create)
router.patch('/:id', ReviewsController.updateById)
router.delete('/:id', ReviewsController.removeById)