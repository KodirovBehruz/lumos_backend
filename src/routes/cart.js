import express from 'express';
import * as CartController from '../controllers/cart.js'
import { auth } from '../middleware/auth.js';

export const router = express.Router();

router.post("/", auth, CartController.addToCart);
router.get("/", auth, CartController.getCart);
router.delete("/:productId", auth, CartController.removeFromCart)
router.put("/", CartController.updateCartItemQuantity)