const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth')

const router = express.Router()

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

router.post('/register', async (req, res) => {

    const { email } = req.body

    try {

        // * caso o usuário já possua um cadastro
        if (await User.findOne({ email }))
            return res.send({ Erro: 'Usuário já possui uma conta' })

        const user = await User.create(req.body)


        // * não retorna a senha do usuário
        user.password = undefined


        return res.status(200).send({
            user,
            token: generateToken({ id: user.id })

        })

    } catch (error) {

        return res.send({ error: "Erro no registro do usuário" })

    }

})


router.post('/authenticate', async (req, res) => {


    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user)
        return res.send({ Erro: "Usuário não encontrado / email errado" })


    if (!await bcrypt.compare(password, user.password))
        return res.send({ Erro: "Senha incorreta" })

    user.password = undefined
    user.results = undefined

    res.status(200).send({
        user,
        token: generateToken({ id: user.id })
    })

})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {

        const user = await User.findOne({ email })

        if (!user) {
            return res.send({ error: "Usuário não encontrado" })
        }

        // ! gerar token

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)


        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        })

        mailer.sendMail({
            to: email,
            from: 'erislandiosoares21@gmail.com',
            template: "auth/forgotPassword",
            context: { token },
        }, (err) => {
            if (err) {
                return res.send({ erro: 'Não foi possível recuperar sua senha' })
            }

            res.status(200).send({ ok: true })
        })

    } catch (err) {
        res.send({ erro: "Erro ao recuperar a senha tente novamente" })
    }

})

router.post('/reset_password', async (req, res) => {

    const { email, password, token } = req.body

    try {

        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')

        if (!user) {
            return res.send({ erro: "Usuário não encontrado." })
        }

        if (token !== user.passwordResetToken) {

            console.log(token, user.passwordResetToken)

            return res.send({ erro: "Token inválido" })
        }

        const now = new Date()

        if (now > user.passwordResetExpires) {
            return res.send({ erro: "Token expirado" })
        }

        user.password = password

        await user.save()

        res.send({ ok: true })

    } catch (err) {
        res.send({ erro: "Não foi possĩvel resetar a senha tente novamente.", ERRO: err })
    }

})

module.exports = app => app.use('/auth', router)