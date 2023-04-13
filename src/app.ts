import express from 'express'
require('express-async-errors')
import { postsRouter } from './routes/posts'
import { errorHandler } from './errorHandler'
import { usersRouter } from './routes/users'
import { authRouter } from './routes/authRouter'
import cookieParser from 'cookie-parser'
const app = express()

// body parser (json)
app.use(express.json())
app.use(cookieParser())


// HTTP API - application programing interface
app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)
app.use(authRouter)

app.use(errorHandler)

app.listen(3333)