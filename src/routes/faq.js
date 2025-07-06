import express from 'express';
import * as FaqController from "../controllers/faq.js"

export const router = express.Router()

router.get("/", FaqController.getList)
router.get("/:id", FaqController.getById)
router.post("/", FaqController.create)
router.patch("/:id", FaqController.updateById)
router.delete("/:id", FaqController.removeById)