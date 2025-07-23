import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import type { WorldState } from '@weave/types'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

const PORT = 3001

app.get('/', (req, res) => {
  res.send('Weave Backend is running!')
})

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`)
})
