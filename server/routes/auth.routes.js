const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const router = express.Router()

// /auth/registration
router.post(
    '/registration',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный пароль (От 6 до 10 символов)').isLength({min:6, max: 10})
    ],
    async (req, res) => {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.status(400).json({
                    errors: validationErrors.array(),
                    message: 'Введены некорректные данные при регистрации'
                });
            }
            
            const { email, password } = await req.body
            const candidate = await User.findOne({ email })

            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' })
            }

            const hashPassword = bcrypt.hashSync(password, 7)

            const user = new User({ email, password: hashPassword })

            await user.save()

            res.status(200).json({ message: 'Пользователь создан' })

        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    }
)

// /auth/login
router.post(
    '/login',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный пароль (От 6 до 10 символов)').isLength({min:6, max: 10})
    ],
    async (req, res) => {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.status(400).json({
                    errors: validationErrors.array(),
                    message: 'Введены некорректные данные при входе в систему'
                });
            }
            
            const { email, password } = await req.body
            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: 'Введены некорректные данные при входе в систему' })
            }
            
            const isMatchPassword = bcrypt.compareSync(password, user.password)

            if (!isMatchPassword) {
                return res.status(400).json({ message: 'Введены некорректные данные при входе в систему' })
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.jwtSecretKey,
                { expiresIn: '1h' }
            )

            res.status(200).json({ token, userId: user.id })

        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    }
)

module.exports = router