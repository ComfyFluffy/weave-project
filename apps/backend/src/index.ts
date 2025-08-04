import 'dotenv/config'

import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import type { Message, User, Character } from '@weave/types'
import { worlds, messages, users, characters, worldState } from './mock'
import { nanoid } from 'nanoid'
import aiRoutes from './routes/ai'

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

// Connected users (active socket connections)
const connectedUsers: {
  [socketId: string]: {
    user: User
    worldId?: string
    selectedCharacterId?: string
    isOnline: boolean
  }
} = {}

app.use(express.json())

// API routes
app.use('/api/ai', aiRoutes)

// REST API endpoints
app.get('/', (req, res) => {
  res.send('Weave Backend is running!')
})

// World endpoints
app.get('/api/worlds', (req, res) => {
  res.json(worlds)
})

app.get('/api/worlds/:worldId', (req, res) => {
  const world = worlds.find((w) => w.id === req.params.worldId)
  if (!world) {
    return res.status(404).json({ error: 'World not found' })
  }
  res.json(world)
})

app.get('/api/worlds/:worldId/state', (req, res) => {
  const { worldId } = req.params
  if (worldId === '1') {
    res.json(worldState)
  } else {
    res.status(404).json({ error: 'World state not found' })
  }
})

// Channel endpoints
app.get('/api/worlds/:worldId/channels', (req, res) => {
  const { worldId } = req.params
  const world = worlds.find((w) => w.id === worldId)
  if (!world) {
    return res.status(404).json({ error: 'World not found' })
  }
  res.json(world.channels)
})

app.get('/api/channels/:channelId/messages', (req, res) => {
  const channelMessages = messages[req.params.channelId] || []
  res.json(channelMessages)
})

// Character endpoints
app.get('/api/worlds/:worldId/characters', (req, res) => {
  const { worldId } = req.params
  if (worldId === '1') {
    res.json(characters)
  } else {
    res.status(404).json({ error: 'Characters not found' })
  }
})

app.post('/api/worlds/:worldId/characters', (req, res) => {
  const { worldId } = req.params
  const characterData = req.body

  if (worldId !== '1') {
    return res.status(404).json({ error: 'World not found' })
  }

  // Generate a new character ID
  const characterId = `char-${nanoid()}`
  const newCharacter: Character = {
    id: characterId,
    name: characterData.name,
    description: characterData.description,
    is_npc: false,
    avatar: characterData.avatar || '👤',
  }

  // Add to characters array
  characters.push(newCharacter)

  // Add character state to world state
  worldState.character_states[characterId] = {
    current_location_name: '金麦酒馆',
    inventory: [],
    health: characterData.health || 100,
    mana: characterData.mana || 50,
    attributes: characterData.attributes || {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    properties: characterData.properties || {
      class: characterData.class || '冒险者',
      level: '1',
    },
    knowledge: [],
    goals: characterData.goals || [],
    secrets: [],
  }

  res.status(201).json(newCharacter)
})

// User endpoints
app.get('/api/users', (req, res) => {
  res.json(users)
})

app.post('/api/users', (req, res) => {
  const userData = req.body
  const userId = `user-${nanoid()}`
  const newUser: User = {
    id: userId,
    username: userData.username,
    avatar: userData.avatar || '👤',
  }

  users.push(newUser)
  res.status(201).json(newUser)
}) // Helper functions
function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to get or create user session
function getUserSession(
  socketId: string,
  userData?: { username: string; avatar?: string }
) {
  if (!connectedUsers[socketId] && userData) {
    // Create new user session
    const user: User = {
      id: `temp-${socketId}`, // Temporary user for session
      username: userData.username,
      avatar: userData.avatar || '👤',
    }

    connectedUsers[socketId] = {
      user,
      isOnline: true,
    }
  }

  return connectedUsers[socketId]
}

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  // User joins with basic info
  socket.on('user:join', (userData: { username: string; avatar?: string }) => {
    const session = getUserSession(socket.id, userData)
    console.log(`User ${session.user.username} joined`)

    // Send user data back
    socket.emit('user:data', session.user)
  })

  // User joins a world
  socket.on('world:join', (worldId: string) => {
    const session = connectedUsers[socket.id]
    if (!session) return

    // Leave previous world room if any
    if (session.worldId) {
      socket.leave(`world:${session.worldId}`)
    }

    // Join new world room
    socket.join(`world:${worldId}`)
    session.worldId = worldId

    console.log(`User ${session.user.username} joined world ${worldId}`)

    // Send world data
    const world = worlds.find((w) => w.id === worldId)
    if (world) {
      socket.emit('world:data', world)

      // Send world state if available
      if (worldId === '1') {
        socket.emit('world:state', worldState)
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
      content: string
      characterId?: string
    }) => {
      const session = connectedUsers[socket.id]
      if (!session) return

      const { characterId } = messageData
      const character = characterId
        ? characters.find((c) => c.id === characterId)
        : null

      const newMessage: Message = {
        id: generateMessageId(),
        channel_id: messageData.channelId,
        user_id: session.user.id,
        character_id: character?.id,
        type: character ? 'character' : 'system',
        content: messageData.content,
        created_at: new Date(),
        character_name: character?.name,
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
    const session = connectedUsers[socket.id]
    if (session) {
      socket.to(`channel:${channelId}`).emit('typing:user', {
        userId: session.user.id,
        username: session.user.username,
        typing: true,
      })
    }
  })

  socket.on('typing:stop', (channelId: string) => {
    const session = connectedUsers[socket.id]
    if (session) {
      socket.to(`channel:${channelId}`).emit('typing:user', {
        userId: session.user.id,
        username: session.user.username,
        typing: false,
      })
    }
  })

  // Character selection
  socket.on(
    'character:select',
    ({ worldId, characterId }: { worldId: string; characterId: string }) => {
      const session = connectedUsers[socket.id]
      if (!session) return

      const character = characters.find((c) => c.id === characterId)
      if (!character) return

      // Update user's selected character
      session.selectedCharacterId = characterId

      console.log(
        `User ${session.user.username} selected character ${character.name} in world ${worldId}`
      )

      // Emit character selection confirmation
      socket.emit('character:selected', character)
    }
  )

  // Handle disconnect
  socket.on('disconnect', () => {
    const session = connectedUsers[socket.id]
    if (session) {
      console.log(`User ${session.user.username} disconnected`)
      delete connectedUsers[socket.id]
    }
  })
})

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`)
})
