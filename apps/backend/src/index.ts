import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import type { Message } from '@weave/types'
import { worlds, messages } from './mock'

const app = express()
const server = http.createServer(app)

// Add CORS middleware for Express
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Add JSON parsing middleware
app.use(express.json())

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

const PORT = 3001

// Connected users
const connectedUsers: {
  [socketId: string]: { id: string; username: string; worldId?: string }
} = {}

app.use(express.json())

// REST API endpoints
app.get('/', (req, res) => {
  res.send('Weave Backend is running!')
})

app.get('/api/worlds', (req, res) => {
  // Return simplified world list for sidebar
  const worldList = worlds.map((world) => ({
    id: world.id,
    name: world.name,
    avatar: getWorldAvatar(world.name),
    hasNotification: hasUnreadMessages(world.id),
  }))
  res.json(worldList)
})

app.get('/api/worlds/:worldId', (req, res) => {
  const world = worlds.find((w) => w.id === req.params.worldId)
  if (!world) {
    return res.status(404).json({ error: 'World not found' })
  }
  res.json(world)
})

app.get('/api/channels/:channelId/messages', (req, res) => {
  const channelMessages = messages[req.params.channelId] || []
  res.json(channelMessages)
})

// Helper functions
function getWorldAvatar(worldName: string): string {
  const avatars: { [key: string]: string } = {
    龙与地下城: '🐉',
    赛博朋克2077: '🤖',
    克苏鲁的呼唤: '🐙',
  }
  return avatars[worldName] || '🌍'
}

function hasUnreadMessages(worldId: string): boolean {
  // Simple logic: return true for world 1 to show notification
  return worldId === '1'
}

function generateMessageId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  // User joins with basic info
  socket.on('user:join', (userData: { username: string }) => {
    connectedUsers[socket.id] = {
      id: socket.id,
      username: userData.username,
    }
    console.log(`User ${userData.username} joined`)
  })

  // User joins a world
  socket.on('world:join', (worldId: string) => {
    if (connectedUsers[socket.id]) {
      // Leave previous world room if any
      if (connectedUsers[socket.id].worldId) {
        socket.leave(`world:${connectedUsers[socket.id].worldId}`)
      }

      // Join new world room
      socket.join(`world:${worldId}`)
      connectedUsers[socket.id].worldId = worldId

      console.log(
        `User ${connectedUsers[socket.id].username} joined world ${worldId}`
      )

      // Send world data
      const world = worlds.find((w) => w.id === worldId)
      if (world) {
        socket.emit('world:data', world)
      }
    }
  })

  // User joins a channel (for receiving messages)
  socket.on('channel:join', (channelId: string) => {
    socket.join(`channel:${channelId}`)

    // Send existing messages
    const channelMessages = messages[channelId] || []
    socket.emit('messages:history', channelMessages)

    console.log(`User joined channel ${channelId}`)
  })

  // User leaves a channel
  socket.on('channel:leave', (channelId: string) => {
    socket.leave(`channel:${channelId}`)
    console.log(`User left channel ${channelId}`)
  })

  // Send message
  socket.on(
    'message:send',
    (messageData: {
      channelId: string
      worldId: string
      content: string
      characterName?: string
    }) => {
      const user = connectedUsers[socket.id]
      if (!user) return

      const newMessage: Message = {
        id: generateMessageId(),
        channelId: messageData.channelId,
        worldId: messageData.worldId,
        authorId: user.id,
        authorName: user.username,
        content: messageData.content,
        timestamp: new Date(),
        type: 'user',
        characterName: messageData.characterName,
      }

      // Store message
      if (!messages[messageData.channelId]) {
        messages[messageData.channelId] = []
      }
      messages[messageData.channelId].push(newMessage)

      // Broadcast to all users in the channel
      io.to(`channel:${messageData.channelId}`).emit('message:new', newMessage)

      console.log(
        `Message sent to channel ${messageData.channelId}: ${messageData.content}`
      )
    }
  )

  // Typing indicators
  socket.on('typing:start', (channelId: string) => {
    const user = connectedUsers[socket.id]
    if (user) {
      socket.to(`channel:${channelId}`).emit('typing:user', {
        userId: user.id,
        username: user.username,
        typing: true,
      })
    }
  })

  socket.on('typing:stop', (channelId: string) => {
    const user = connectedUsers[socket.id]
    if (user) {
      socket.to(`channel:${channelId}`).emit('typing:user', {
        userId: user.id,
        username: user.username,
        typing: false,
      })
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = connectedUsers[socket.id]
    if (user) {
      console.log(`User ${user.username} disconnected`)
      delete connectedUsers[socket.id]
    }
  })
})

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`)
})
