import { Router } from "express"
import { z } from "zod"
import db from "../db"
import { verifyToken } from "../auth"

export const postsRouter = Router()
// RESTful API
// CRUD resources
// Read
postsRouter.get('/',  async (req, res) => {
    const { skip, limit } = req.query
    if (typeof skip === 'string' && typeof limit === 'string') {
        const posts = await db.post.findMany({
            skip: +skip,
            take: +limit
        })
        res.send(posts)
    } else {
        const allPosts = await db.post.findMany()
        res.send(allPosts)
    }
})

//Read
// '/api/posts/12345'
postsRouter.get('/:postId', verifyToken, async (req, res) => {
    // const postId = req.params.id
    const schema = z.number()
    const postId = await schema.safeParseAsync(+req.params.postId)
    if (postId.success) {
        const post = await db.post.findUnique({
            where: {
                id: postId.data
            }
        })
        if (post) res.send(post)
        else res.status(404).send({
            message: 'Cannot find this PostID'
        })
        res.send(post)
    } else {
        res.status(400).send({ message: "Wrong PostID" })
    }
})

// Create
postsRouter.post('/', verifyToken, async (req, res, next) => {
    // type guard
    if (!req.user) return res.status(401).send({
        message: "Wrong token"
    })
    const schema = z.object({
        title: z.string(),
        text: z.string(),
    })
    const newPost = await schema.parseAsync(req.body)
    const newPostDB = await db.post.create({
        data: {
            userId: req.user.id,
            title: newPost.title,
            text: newPost.text
        }
    })
    res.send(newPostDB)
})

//Update (patch, put)
postsRouter.patch('/:postId', verifyToken, async (req, res, next) => {
    // type guard condition
    if (!req.user) return res.status(401).send({
        message: "Wrong token"
    })
    const schemaBody = z.object({
        title: z.string().optional(),
        text: z.string().optional(),
    })

    const schemaPostId = z.number()
    const postId = await schemaPostId.parseAsync(+req.params.postId)
    const updatedPost = await schemaBody.parseAsync(req.body)
    const existedPostDb = await db.post.findUnique({
        where: {
            id: postId
        }
    })
    if (!existedPostDb) return res.status(404).send({
        message: "Wrong postID"
    })
    if (!req.user.isAdmin && req.user.id !== existedPostDb.userId) return res.status(403).send({
        message: 'No permisions'
    })
    const updatedPostDb = await db.post.update({
        where: {
            id: +postId
        },
        data: updatedPost
    })
    res.send(updatedPostDb)
})


//Delete
postsRouter.delete('/:postId', verifyToken, async (req, res) => {
     if (!req.user) return res.status(401).send({
        message: "Wrong token"
    })
    const schemaPostId = z.number()
    const postId = await schemaPostId.parseAsync(+req.params.postId)
    const existedPostDb = await db.post.findUnique({
        where: {
            id: postId
        }
    })
    if (!existedPostDb) return res.status(404).send({
        message: "Wrong postID"
    })
    if (!req.user.isAdmin && req.user.id !== existedPostDb.userId) return res.status(403).send({
        message: 'No permisions'
    })
    const removedPost = await db.post.delete({
        where: {
            id: +postId
        }
    })
    res.send(removedPost)
})
