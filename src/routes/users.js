import * as UsersController from '../controllers/users.js';
import express from 'express';

export const router = express.Router();

router.post('/register', UsersController.register)
router.post('/login', UsersController.login)
router.get('/self', UsersController.getSelf)
router.post('/refresh-token', UsersController.refreshToken)