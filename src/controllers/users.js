import { Users } from '../models/Users.js';
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from 'dotenv';

dotenv.config({ path: '.env' })

export const register = async (req, res) => {
    try {
        const { username, email, phoneNumber, password } = req.body;

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await Users.create({
            username,
            email,
            phoneNumber,
            password: hash,
        })
        const accessToken =  jwt.sign(
            { id: user.id, },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )
        const refreshToken =  jwt.sign(
            { id: user.id, },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        user.refreshToken = refreshToken
        await user.save()
        res.message(201).json({
            result: {
                ...user.toJSON(),
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.log("Регистрация...\n", error);
        res.status(400).json({
            message: 'Не удалось зарегистрировать'
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ where: { email } })
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const isValidPass = await bcrypt.compare(password, user.password)
        if (!isValidPass) {
            return res.status(401).json({
                message: 'Не удалось авторизироваться'
            })
        }

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        user.refreshToken = refreshToken
        await user.save()
        res.status(200).json({
            result: {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        console.log("Авторизация...\n", error);
        return res.status(401).json({
            message: 'Не удалось авторизироваться'
        })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            return res.status(403).json({ message: "Токен отсутствует" })
        }
        const user = await Users.findOne({ where: { refreshToken } })
        if (!user) {
            return res.status(403).json({ message: 'Токен недействителен' });
        }
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Ошибка верификации токена" })
            }
            const newAccessToken = jwt.sign(
                { id: decoded.id },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            )
            res.status(200).json({ accessToken: newAccessToken })
        })
    } catch (error) {
        console.log("Обновление токена...\n", error);
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}

export const getSelf = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1]
        if (!accessToken) {
            return res.status(403).json({ message: 'Токен отсутствует' })
        }
        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
            const user = await Users.findByPk(decoded.id)
            if (!user) {
                return res.status(401).json({
                    message: "Пользователь не найден"
                })
            }
            const { password: _, ...userData } = user.toJSON()

            res.status(200).json({
                result: userData
            })
        } catch (error) {
            return res.status(401).json({
                message: 'Неверный или истёкший токен',
            })
        }
    } catch (error) {
        console.log("Получении getSelf()...\n", error);
        res.status(500).json({
            message: 'Ошибка сервера',
        })
    }
}