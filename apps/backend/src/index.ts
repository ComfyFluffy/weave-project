import 'dotenv/config'

import express, { Router } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

// Import services and routes
import { MockDatabaseService } from './services/database.memory'
import { createWorldRouter } from './routes/worlds'
import { createWorldStateRouter } from './routes/world-states'
import { createCharacterRouter } from './routes/characters'
import { createMessageRouter } from './routes/messages'
import { createAIRoutes } from './routes/ai'
import { createExpressEndpoints, initServer } from '@ts-rest/express'
import { createAuthRouter } from './routes/auth'
import { contract } from '@weave/types/apis'

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

// Current active users per channel
const activeUsers: Record<string, Set<string>> = {}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('send-message', async (messageData) => {
    try {
      // Save message to database
      const message = await dbService.createMessage(messageData)

      // Broadcast message to all users in the channel
      io.to(message.channelId).emit('new-message', message)
    } catch (error) {
      console.error('Error saving message:', error)
      // Still broadcast the message even if saving fails
      io.to(messageData.channelId).emit('new-message', messageData)
    }
  })

  socket.on('disconnect', () => {
    // Remove user from all channels
    for (const channelId in activeUsers) {
      const userFound = Array.from(activeUsers[channelId]).find((username) => {
        // This is a simple check - in a real app you'd track socket-to-user mapping
        return true // Would need proper user-socket mapping to implement this correctly
      })

      if (activeUsers[channelId].size === 0) {
        delete activeUsers[channelId]
      } else {
        io.to(channelId).emit(
          'active-users-updated',
          Array.from(activeUsers[channelId])
        )
      }
    }

    console.log('User disconnected:', socket.id)
  })
})

// World state update emitter (Socket.IO broadcast hook)
const emitWorldStateUpdate = (worldStateId: string, worldState: any) => {
  io.to(worldStateId).emit('world-state:updated', { worldStateId, worldState })
}

app.use('/api/ai', createAIRoutes(dbService))

const authRouter = createAuthRouter(dbService)
const characterRouter = createCharacterRouter(dbService)
const messageRouter = createMessageRouter(dbService)
const worldStateRouter = createWorldStateRouter(dbService)
const worldRouter = createWorldRouter(dbService)

const restRouter = initServer().router(contract, {
  auth: authRouter,
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
