import dotenv from 'dotenv'
import compression from 'compression'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { AuthAPIMiddleware, invalidJSONMiddleware } from './helpers'
import nodemailer from 'nodemailer'
import Joi from 'joi'

dotenv.config()
const app = express()

app.use(cors())
app.use(compression())
app.use(express.json())
app.use(AuthAPIMiddleware)
app.use(invalidJSONMiddleware)

app.post('/', async (req: Request, res: Response) => {

    const {
        DEFAULT_SENDER_HOST,
        DEFAULT_SENDER_PORT,
        DEFAULT_SENDER_USER,
        DEFAULT_SENDER_PASSWORD,
        DEFAULT_SENDER_EMAIL } = process.env

    const validator = Joi.object({
        config: Joi.object({
            host: Joi.string().domain().default(DEFAULT_SENDER_HOST),
            port: Joi.number().default(DEFAULT_SENDER_PORT),
            secure: Joi.boolean().default(false),
            auth: Joi.object({
                user: Joi.string().default(DEFAULT_SENDER_USER),
                pass: Joi.string().default(DEFAULT_SENDER_PASSWORD),
            }).default()
        }).default(),
        data: Joi.object({
            from: Joi.string().email().default(DEFAULT_SENDER_EMAIL),
            to: Joi.string().email().required(),
            subject: Joi.string().required(),
            text: Joi.string().required(),
            html: Joi.string().required()
        }).required()
    })

    const data = validator.validate(req.body)

    if (data.error) {
        res.status(400).json({
            status: 400,
            message: data.error.details[0].message
        })
        return
    }

    try {

        const transporter = nodemailer.createTransport({
            ...data.value.config,
        })

        const result = await transporter.sendMail({
            ...data.value.data
        })

        res.json({
            message: 'Se envió el correo',
            info: result
        })

        transporter.close()
        return

    } catch (e) {
        res.status(401).json({
            status: 401,
            message: (e as Error).message
        })
    }
})

app.all("*", (req, res) => {
    res.status(400).json({
        status: 400,
        params: req.body ?? req.query,
        message: `${req.method} ${req.url} Not exists`,
    });
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`)
})