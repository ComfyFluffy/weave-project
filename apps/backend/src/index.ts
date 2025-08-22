import 'dotenv/config'

import express, { Router } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

// Import services and routes
import { createWorldRouter } from './routes/worlds'
import { createWorldStateRouter } from './routes/world-states'
import { createCharacterRouter } from './routes/characters'
import { createMessageRouter } from './routes/messages'
import { createAIRoutes } from './routes/ai'
import { createExpressEndpoints, initServer } from '@ts-rest/express'
import { createAuthRouter } from './routes/auth'
import { contract, MessageSendInputSchema } from '@weave/types/apis'
import { createJwtMiddleware } from './middleware/jwt'
import { createChannelRouter } from './routes/channels'
import { prisma } from './services/database'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// Initialize JWT middleware
const jwtMiddleware = createJwtMiddleware()
// const verifyUserMiddleware = createVerifyUserMiddleware(dbService)

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json())

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Handle joining a channel room
  socket.on('channel:join', (channelId: string) => {
    console.log(`User ${socket.id} joining channel: ${channelId}`)
    void socket.join(channelId)
  })

  // Handle leaving a channel room
  socket.on('channel:leave', (channelId: string) => {
    console.log(`User ${socket.id} leaving channel: ${channelId}`)
    void socket.leave(channelId)
  })

  socket.on('message:send', async (input) => {
    const parsedInput = MessageSendInputSchema.parse(input)
    // Save message to database
    const message = await prisma.message.create({
      data: {
        type: parsedInput.type,
        channelId: parsedInput.channelId,
        content: parsedInput.content,
        userId: parsedInput.userId ?? null,
        characterId: parsedInput.characterId ?? null,
      },
    })

    // Broadcast message to all users in the channel
    io.to(message.channelId).emit('message:new', message)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

app.use('/api/ai', createAIRoutes())

const authRouter = createAuthRouter()
const characterRouter = createCharacterRouter()
const channelRouter = createChannelRouter()
const messageRouter = createMessageRouter()
const worldStateRouter = createWorldStateRouter()
const worldRouter = createWorldRouter()

const restRouter = initServer().router(contract, {
  auth: authRouter,
  channel: channelRouter,
  character: characterRouter,
  message: messageRouter,
  worldState: worldStateRouter,
  world: worldRouter,
})

const expressApiRouter = Router()
// Apply JWT middleware to all routes except auth
expressApiRouter.use('/channels', jwtMiddleware)
expressApiRouter.use('/characters', jwtMiddleware)
expressApiRouter.use('/messages', jwtMiddleware)
expressApiRouter.use('/world-states', jwtMiddleware)
expressApiRouter.use('/worlds', jwtMiddleware)

createExpressEndpoints(contract, restRouter, expressApiRouter)

app.use('/api', expressApiRouter)

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`)
})
