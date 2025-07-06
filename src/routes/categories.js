import * as CategoriesController from '../controllers/categories.js';
import express from 'express';
import upload from '../helpers/fileStorage.js';

export const router = express.Router();

router.get("/", CategoriesController.getList)
router.post("/", upload.single('image'), CategoriesController.create)