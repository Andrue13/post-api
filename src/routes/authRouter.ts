import { Router } from "express"
import { z } from "zod"
import { createToken } from "../auth"
import db from "../db"
import { compareSync, hashSync } from "bcryptjs"

export const authRouter = Router()

// Authenntication => Login + Password => Token
authRouter.post('/api/login', async (req, res, next) => {
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(3).max(30)
    })
    const user = await schema.parseAsync(req.body)
    const userDb = await db.user.findUnique({
        where: {
            email: user.email
        }
    })
    if (userDb && compareSync(user.password, userDb?.passwordHash)) {
        const token = await createToken(userDb.id)
        res.cookie('token', token, {
            // xss atack
            httpOnly: true,
            expires: new Date(Date.now() + 2 * 24 * 3600 * 1000)
        })
        res.cookie('test', 'Hello world')
        res.send({
            message: 'Successful login'
        })
    } else {
        res.status(401).send({
            message: 'Wrong credentials'
        })
    }
})


authRouter.post('/api/signup', async (req, res, next) => {
    const schema = z.object({
        email: z.string().email(),
        name: z.string().max(30),
        password: z.string().min(3).max(30)
    })
    const newUser = await schema.parseAsync(req.body)
    const passwordHash = hashSync(newUser.password)
    const userDb = await db.user.create({
        data: {
            email: newUser.email,
            name: newUser.name,
            passwordHash: passwordHash 
        }
    })
    const token = await createToken(userDb.id)
        res.cookie('token', token, {
            // xss atack
            httpOnly: true,
            expires: new Date(Date.now() + 2 * 24 * 3600 * 1000)
        })
        res.send({
            message: 'Successful signup'
        })
})





