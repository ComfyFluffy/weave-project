import 'dotenv/config'

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

// Import services and routes
import { MockDatabaseService } from './services/database.memory'
import { createWorldRoutes } from './routes/worlds'
import { createWorldStateRoutes } from './routes/world-states'
import { createCharacterRoutes } from './routes/characters'
import { createMessageRoutes } from './routes/messages'
import { createUserRoutes } from './routes/users'
import { createItemRoutes } from './routes/items'
import { createAIRoutes } from './routes/ai'
import { createAuthRoutes } from './routes/auth'
import { superjsonMiddleware } from './lib/response'

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
app.use(superjsonMiddleware())

// Current active users per channel
const activeUsers: Record<string, Set<string>> = {}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-channel', ({ channelId, username }) => {
    void socket.join(channelId)

    // Add user to active users
    if (!activeUsers[channelId]) {
      activeUsers[channelId] = new Set()
    }
    activeUsers[channelId].add(username)

    // Broadcast updated user list
    io.to(channelId).emit(
      'active-users-updated',
      Array.from(activeUsers[channelId])
    )

    console.log(`${username} joined channel ${channelId}`)
  })

  socket.on('leave-channel', ({ channelId, username }) => {
    void socket.leave(channelId)

    // Remove user from active users
    if (activeUsers[channelId]) {
      activeUsers[channelId].delete(username)
      if (activeUsers[channelId].size === 0) {
        delete activeUsers[channelId]
      }
    }

    // Broadcast updated user list
    io.to(channelId).emit(
      'active-users-updated',
      activeUsers[channelId] ? Array.from(activeUsers[channelId]) : []
    )

    console.log(`${username} left channel ${channelId}`)
  })

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

  socket.on('typing-start', ({ channelId, username }) => {
    socket.to(channelId).emit('user-typing', { username, isTyping: true })
  })

  socket.on('typing-stop', ({ channelId, username }) => {
    socket.to(channelId).emit('user-typing', { username, isTyping: false })
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

// Mount API routes
app.use('/api/worlds', createWorldRoutes(dbService))
app.use(
  '/api/world-states',
  createWorldStateRoutes(dbService, emitWorldStateUpdate)
)
app.use('/api/characters', createCharacterRoutes(dbService))
app.use('/api/messages', createMessageRoutes(dbService))
app.use('/api/users', createUserRoutes(dbService))
app.use('/api/items', createItemRoutes(dbService))
app.use('/api/ai', createAIRoutes(dbService))
app.use('/api/auth', createAuthRoutes(dbService))

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`)
})
