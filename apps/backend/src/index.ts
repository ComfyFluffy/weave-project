import 'dotenv/config'

import express, { Router } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

// Import services and routes
import { MockDatabaseService } from './services/database.memory'
import { createChannelRouter } from './routes/channels'
import { createWorldRouter } from './routes/worlds'
import { createWorldStateRouter } from './routes/world-states'
import { createCharacterRouter } from './routes/characters'
import { createMessageRouter } from './routes/messages'
import { createAIRoutes } from './routes/ai'
import { createExpressEndpoints, initServer } from '@ts-rest/express'
import { createAuthRouter } from './routes/auth'
import { contract, MessageSendInputSchema } from '@weave/types/apis'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// Initialize database service
const dbService = new MockDatabaseService()

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
    const message = await dbService.createMessage({
      ...parsedInput,
    })

    // Broadcast message to all users in the channel
    io.to(message.channelId).emit('message:new', message)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

app.use('/api/ai', createAIRoutes(dbService))

const authRouter = createAuthRouter(dbService)
const channelRouter = createChannelRouter(dbService)
const characterRouter = createCharacterRouter(dbService)
const messageRouter = createMessageRouter(dbService)
const worldStateRouter = createWorldStateRouter(dbService)
const worldRouter = createWorldRouter(dbService)

const restRouter = initServer().router(contract, {
  auth: authRouter,
  channel: channelRouter,
  character: characterRouter,
  message: messageRouter,
  worldState: worldStateRouter,
  world: worldRouter,
})

const expressApiRouter = Router()
createExpressEndpoints(contract, restRouter, expressApiRouter)

app.use('/api', expressApiRouter)

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`)
})
