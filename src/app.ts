import express from 'express'
require('express-async-errors')
import { postsRouter } from './routes/posts'
import { errorHandler } from './errorHandler'
import { usersRouter } from './routes/users'
import { authRouter } from './routes/authRouter'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()
// app.use(cors({
//     origin: ['http://localhost:5173']

// }))

// body parser (json)
app.use(express.json())
app.use(cookieParser())


// HTTP API - application programing interface
app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)
app.use(authRouter)

app.use(errorHandler)

app.listen(3333)