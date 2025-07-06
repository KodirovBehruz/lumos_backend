import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' })

export const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(403).json({ message: 'Токен отсутствует' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Неверный или истёкший токен' })
        req.user = user;
        next()
    })
}