import { Router } from "express"
import { z } from "zod"
import db from "../db"
import  { hashSync } from 'bcryptjs'
import { Prisma } from ".prisma/client"
import { verifyToken } from "../auth"


export const usersRouter = Router()
// CRUD for Users
// Read
// GET 
usersRouter.get('/', verifyToken, async (req, res) => {
    const { skip, limit } = req.query
    // Guard condition
    if (!req.user?.isAdmin) return res.status(403).send({
        message: 'No permisions'
    })
    if (typeof skip === 'string' && typeof limit === 'string') {
        const users = await db.user.findMany({
            skip: +skip,
            take: +limit
        })
        res.send(users)
    } else {
        const allUsers = await db.user.findMany()
        res.send(allUsers)
    }
})

//Read
// '/api/users/12345'
usersRouter.get('/:userId', verifyToken, async (req, res) => {
    const schema = z.number()
    const userId = await schema.safeParseAsync(+req.params.userId)
    if (userId.success) {
        if (req.user?.id !== userId.data && req.user?.isAdmin !== true) return res.status(403).send({
            message: 'No permisions'
        })
        const user = await db.user.findUnique({
            where: {
                id: userId.data
            }
        })
        if (user) res.send(user)
        else res.status(404).send({
            message: 'Cannot find this PostID'
        })
        res.send(user)
        res.send(user)
    } else {
        res.status(400).send({ message: "Wrong userID" })
    }
})

// Create
usersRouter.post('/', verifyToken, async (req, res, next) => {
    if (req.user?.isAdmin !== true) return res.status(403).send({
        message: 'No permisions'
    })
    const schema = z.object({
        email: z.string().email(),
        name: z.string().max(30),
        password: z.string().min(3).max(30)
    })
    const newUser = await schema.parseAsync(req.body)
    const passwordHash = hashSync(newUser.password)
    const newUserDB = await db.user.create({
        data: {
            email: newUser.email,
            name: newUser.name,
            passwordHash: passwordHash 
        }
    })
    res.send(newUserDB)
})

//Update (patch, put)
usersRouter.patch('/:userId', verifyToken, async (req, res, next) => {
    const schemaBody = z.object({
        email: z.string().email().optional(),
        name: z.string().max(30).optional(),
        password: z.string().min(3).max(30).optional()
    })

    const schemaUserId = z.number()
    const userId = await schemaUserId.parseAsync(+req.params.userId)
    const parsedUser = await schemaBody.parseAsync(req.body)
    const updatedUser: Prisma.UserUpdateInput = {}
    if (parsedUser.email) updatedUser.email = parsedUser.email
    if (parsedUser.password) updatedUser.passwordHash = hashSync(parsedUser.password)
    if (parsedUser.name) updatedUser.name = parsedUser.name
    
    const updatedUserDb = await db.user.update({
        where: {
            id: userId
        },
        data: updatedUser
    })
    res.send(updatedUserDb)
})

//Delete
usersRouter.delete('/:userId', async (req, res) => {
    if (req.user?.id !== userId.data && req.user?.isAdmin !== true) return res.status(403).send({
        message: 'No permisions'
    })
    const schemaUserId = z.number()
    const userId = await schemaUserId.parseAsync(+req.params.userId)
    const removedUser = await db.user.delete({
        where: {
            id: +userId
        }
    })
    res.send(removedUser)
})