import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import type { Channel, Message, PlayerCharacter } from '@weave/types'
import { worlds, messages } from './mock'
import { nanoid } from 'nanoid'

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
  [socketId: string]: {
    id: string
    username: string
    worldId?: string
    selectedCharacterId?: string
  }
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

// Channel endpoints
app.get('/api/worlds/:worldId/channels', (req, res) => {
  const { worldId } = req.params
  const world = worlds.find((w) => w.id === worldId)
  if (!world) {
    return res.status(404).json({ error: 'World not found' })
  }
  res.json(world.channels)
})

app.post('/api/worlds/:worldId/channels', (req, res) => {
  const { worldId } = req.params
  const { name, type, description } = req.body

  const world = worlds.find((w) => w.id === worldId)
  if (!world) {
    return res.status(404).json({ error: 'World not found' })
  }

  const newChannel: Channel = {
    id: `channel_${Date.now()}`,
    name,
    type: type || 'ic',
    description,
    createdBy: 'system', // In real app, this would be current user
    createdAt: new Date(),
  }

  world.channels.push(newChannel)
  res.status(201).json(newChannel)
})

app.delete('/api/worlds/:worldId/channels/:channelId', (req, res) => {
  const { worldId, channelId } = req.params

  const world = worlds.find((w) => w.id === worldId)
  if (!world) {
    return res.status(404).json({ error: 'World not found' })
  }

  const channelIndex = world.channels.findIndex((c) => c.id === channelId)
  if (channelIndex === -1) {
    return res.status(404).json({ error: 'Channel not found' })
  }

  // Prevent deletion of system channels
  const channel = world.channels[channelIndex]
  if (channel.type === 'announcement' || channel.type === 'rules') {
    return res.status(400).json({ error: 'Cannot delete system channels' })
  }

  world.channels.splice(channelIndex, 1)
  res.status(204).send()
})

// Character endpoints
app.get('/api/worlds/:worldId/characters', (req, res) => {
  const worldId = req.params.worldId
  const world = worlds.find((w) => w.id === worldId)

  if (!world) {
    return res.status(404).json({ error: 'World not found' })
  }

  const characters = Object.values(world.state.characters)
  res.json(characters)
})

app.post('/api/worlds/:worldId/characters', (req, res) => {
  const worldId = req.params.worldId
  const characterData = req.body

  const world = worlds.find((w) => w.id === worldId)
  if (!world) {
    return res.status(404).json({ error: 'World not found' })
  }

  // Generate a new character ID
  const characterId = `char:${nanoid()}`
  const newCharacter: PlayerCharacter = {
    id: characterId,
    ...characterData,
  }

  // Add to world's characters
  world.state.characters[characterId] = newCharacter

  res.status(201).json(newCharacter)
})

app.put('/api/worlds/:worldId/members/:socketId/character', (req, res) => {
  const { worldId, socketId } = req.params
  const { characterId } = req.body

  const world = worlds.find((w) => w.id === worldId)
  if (!world) {
    return res.status(404).json({ error: 'World not found' })
  }

  const character = world.state.characters[characterId]
  if (!character) {
    return res.status(404).json({ error: 'Character not found' })
  }

  // Update connected user's selected character
  if (connectedUsers[socketId]) {
    connectedUsers[socketId].selectedCharacterId = characterId
  }

  // Update or create member in world
  let member = world.members.find((m) => m.id === socketId)
  if (!member) {
    member = {
      id: socketId,
      username: connectedUsers[socketId]?.username || '玩家',
      role: 'player',
      isOnline: true,
    }
    world.members.push(member)
  }
  member.character = character

  res.json({ success: true })
}) // Helper functions
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

// Helper function to update world members list
function updateWorldMember(
  worldId: string,
  socketId: string,
  isOnline: boolean = true
) {
  const world = worlds.find((w) => w.id === worldId)
  const user = connectedUsers[socketId]

  if (!world || !user) return

  let member = world.members.find((m) => m.id === socketId)

  if (!member && isOnline) {
    // Create new member
    member = {
      id: socketId,
      username: user.username,
      role: 'player',
      isOnline: true,
    }
    world.members.push(member)
  } else if (member) {
    // Update existing member
    member.isOnline = isOnline
    member.username = user.username

    // Add character if user has one selected
    if (user.selectedCharacterId) {
      const character = world.state.characters[user.selectedCharacterId]
      if (character) {
        member.character = character
      }
    }
  }

  // Remove offline members after some time (immediate for demo)
  if (!isOnline) {
    world.members = world.members.filter((m) => m.id !== socketId)
  }
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
        const oldWorldId = connectedUsers[socket.id].worldId!
        socket.leave(`world:${oldWorldId}`)
        updateWorldMember(oldWorldId, socket.id, false) // Mark as offline in old world
      }

      // Join new world room
      socket.join(`world:${worldId}`)
      connectedUsers[socket.id].worldId = worldId

      // Update member list in new world
      updateWorldMember(worldId, socket.id, true)

      console.log(
        `User ${connectedUsers[socket.id].username} joined world ${worldId}`
      )

      // Send world data
      const world = worlds.find((w) => w.id === worldId)
      if (world) {
        socket.emit('world:data', world)
        // Broadcast updated member list to all users in world
        io.to(`world:${worldId}`).emit('world:members-updated', world.members)
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

  // Character selection
  socket.on(
    'character:select',
    ({ worldId, characterId }: { worldId: string; characterId: string }) => {
      const user = connectedUsers[socket.id]
      if (!user) return

      const world = worlds.find((w) => w.id === worldId)
      if (!world) return

      const character = world.state.characters[characterId]
      if (!character) return

      // Update user's selected character
      connectedUsers[socket.id].selectedCharacterId = characterId

      // Update world member
      updateWorldMember(worldId, socket.id, true)

      // Broadcast updated member list
      io.to(`world:${worldId}`).emit('world:members-updated', world.members)

      console.log(
        `User ${user.username} selected character ${character.name} in world ${worldId}`
      )
    }
  )

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = connectedUsers[socket.id]
    if (user) {
      console.log(`User ${user.username} disconnected`)

      // Update world member list if user was in a world
      if (user.worldId) {
        updateWorldMember(user.worldId, socket.id, false)

        // Broadcast updated member list
        const world = worlds.find((w) => w.id === user.worldId)
        if (world) {
          io.to(`world:${user.worldId}`).emit(
            'world:members-updated',
            world.members
          )
        }
      }

      delete connectedUsers[socket.id]
    }
  })
})

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`)
})
