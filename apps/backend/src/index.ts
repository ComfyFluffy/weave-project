import 'dotenv/config'

import express, { Router } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

// Import services and routes
import { createWorldRouter } from './routes/worlds'
import {
  createWorldStateRouter,
  setSocketIO as setWorldStateSocketIO,
} from './routes/world-states'
import {
  createCharacterRouter,
  setSocketIO as setCharacterSocketIO,
} from './routes/characters'
import { createMessageRouter } from './routes/messages'
import { createAIRoutes } from './routes/ai'
import { createExpressEndpoints, initServer } from '@ts-rest/express'
import { createAuthRouter } from './routes/auth'
import { createUserRouter } from './routes/users'
import { contract, MessageSendInputSchema } from '@weave/types/apis'
import { createJwtMiddleware } from './middleware/jwt'
import {
  socketAuthMiddleware,
  AuthenticatedSocket,
} from './middleware/socket-auth'
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

// Apply authentication middleware to all socket connections
io.use(socketAuthMiddleware)

// Set Socket.IO instance for routers
setWorldStateSocketIO(io)
setCharacterSocketIO(io)

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
io.on('connection', (socket: AuthenticatedSocket) => {
  console.log(
    `User connected: ${socket.user?.displayName} (${socket.userId}) - Socket: ${socket.id}`
  )

  // Handle joining a channel room
  socket.on('channel:join', (channelId: string) => {
    console.log(
      `User ${socket.user?.displayName} joining channel: ${channelId}`
    )
    void socket.join(channelId)
  })

  // Handle leaving a channel room
  socket.on('channel:leave', (channelId: string) => {
    console.log(
      `User ${socket.user?.displayName} leaving channel: ${channelId}`
    )
    void socket.leave(channelId)
  })

  socket.on('message:send', async (input) => {
    try {
      // Parse and validate input
      const parsedInput = MessageSendInputSchema.parse(input)

      // Ensure the message is from the authenticated user
      const messageData = {
        type: parsedInput.type,
        channelId: parsedInput.channelId,
        content: parsedInput.content,
        userId: socket.userId!, // Always use the authenticated user ID
        characterId: parsedInput.characterId ?? null,
      }

      // Save message to database
      const message = await prisma.message.create({
        data: messageData,
      })

      console.log(
        `Message sent by ${socket.user?.displayName} in channel ${parsedInput.channelId}`
      )

      // Broadcast message to all users in the channel
      io.to(message.channelId).emit('message:new', message)
    } catch (error) {
      console.error('Error handling message send:', error)
      socket.emit('error', { message: 'Failed to send message' })
    }
  })

  socket.on('disconnect', () => {
    console.log(
      `User disconnected: ${socket.user?.displayName} (${socket.userId}) - Socket: ${socket.id}`
    )
  })
})

app.use('/api/ai', createAIRoutes())

const authRouter = createAuthRouter()
const userRouter = createUserRouter()
const characterRouter = createCharacterRouter()
const channelRouter = createChannelRouter()
const messageRouter = createMessageRouter()
const worldStateRouter = createWorldStateRouter()
const worldRouter = createWorldRouter()

const restRouter = initServer().router(contract, {
  auth: authRouter,
  user: userRouter,
  channel: channelRouter,
  character: characterRouter,
  message: messageRouter,
  worldState: worldStateRouter,
  world: worldRouter,
})

const expressApiRouter = Router()

// Create middleware that excludes auth routes
const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Skip JWT middleware for auth routes
  if (req.path.startsWith('/auth')) {
    return next()
  }

  // Apply JWT middleware for all other routes
  return jwtMiddleware(req, res, next)
}

// Apply JWT middleware to all API routes except auth
expressApiRouter.use(authMiddleware)

createExpressEndpoints(contract, restRouter, expressApiRouter)

app.use('/api', expressApiRouter)

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`)
})
