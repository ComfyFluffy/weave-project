import { io, Socket } from 'socket.io-client'
import type { Message } from '@weave/types'
import type { MessageSendInput } from '@weave/types/apis'
import type { WorldState, Character } from '@weave/types'
import { getStoredToken } from '../utils/auth-storage'

export class SocketService {
  socket: Socket
  private worldStateUpdateCallbacks: Set<(data: { worldStateId: string; worldState: WorldState }) => void> = new Set()
  private charactersUpdateCallbacks: Set<(data: { worldStateId: string; characters: Character[] }) => void> = new Set()

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

    // Set up world state update listeners
    this.setupWorldStateUpdateListeners()
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
    this.setupWorldStateUpdateListeners()
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

  private setupWorldStateUpdateListeners() {
    // Listen for world state updates
    this.socket.on('worldState:updated', (data: { worldStateId: string; worldState: WorldState }) => {
      console.log('World state updated:', data)
      // Notify all registered callbacks
      this.worldStateUpdateCallbacks.forEach(callback => callback(data))
    })

    // Listen for character updates
    this.socket.on('characters:updated', (data: { worldStateId: string; characters: Character[] }) => {
      console.log('Characters updated:', data)
      // Notify all registered callbacks
      this.charactersUpdateCallbacks.forEach(callback => callback(data))
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

  // Register callback for world state updates
  onWorldStateUpdated(callback: (data: { worldStateId: string; worldState: WorldState }) => void) {
    this.worldStateUpdateCallbacks.add(callback)
    
    // Return a function to unregister the callback
    return () => {
      this.worldStateUpdateCallbacks.delete(callback)
    }
  }

  // Register callback for character updates
  onCharactersUpdated(callback: (data: { worldStateId: string; characters: Character[] }) => void) {
    this.charactersUpdateCallbacks.add(callback)
    
    // Return a function to unregister the callback
    return () => {
      this.charactersUpdateCallbacks.delete(callback)
    }
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
