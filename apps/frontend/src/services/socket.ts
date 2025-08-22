import { io, Socket } from 'socket.io-client'
import type { Message } from '@weave/types'
import type { MessageSendInput } from '@weave/types/apis'
import { getStoredToken } from '../utils/auth-storage'

export class SocketService {
  socket: Socket

  constructor() {
    // Initialize socket with authentication
    this.socket = this.createAuthenticatedSocket()

    this.socket.on('connect', () => {
      console.log('Connected to server with authentication')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message)
      // If authentication fails, try to reconnect with new token
      if (error.message.includes('Authentication')) {
        this.reconnectWithAuth()
      }
    })
  }

  private createAuthenticatedSocket(): Socket {
    const token = getStoredToken()

    return io('http://localhost:3001', {
      auth: {
        token,
      },
    })
  }

  // Reconnect with current authentication token
  reconnectWithAuth() {
    console.log('Reconnecting with fresh authentication...')
    this.socket.disconnect()
    this.socket = this.createAuthenticatedSocket()
    this.setupEventListeners()
  }

  private setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Reconnected to server with authentication')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message)
    })
  }

  sendMessage(message: MessageSendInput) {
    this.socket.emit('message:send', message)
  }

  joinChannel(channelId: string) {
    this.socket.emit('channel:join', channelId)
  }

  leaveChannel(channelId: string) {
    this.socket.emit('channel:leave', channelId)
  }

  onNewMessage(callback: (message: Message) => void) {
    this.socket.on('message:new', callback)
  }

  off(event: string, callback?: (message: Message) => void) {
    this.socket.off(event, callback)
  }

  // Method to update authentication when user logs in/out
  updateAuth() {
    this.reconnectWithAuth()
  }
}

export const socketService = new SocketService()
