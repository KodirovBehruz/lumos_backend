import express from 'express';
import { router as productsRoutes } from './products.js';
import { router as categoriesRoutes } from './categories.js';
import { router as reviewsRoutes } from './reviews.js';
import { router as faqRoutes } from './faq.js';
import { router as usersRouter } from './users.js'
import { router as cartRouter } from "./cart.js"

const router = express.Router();

router.use('/products', productsRoutes)
router.use('/categories', categoriesRoutes)
router.use('/reviews', reviewsRoutes)
router.use('/faq', faqRoutes)
router.use('/auth', usersRouter)
router.use('/cart', cartRouter)


export default router;