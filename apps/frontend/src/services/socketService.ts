import { io, Socket } from 'socket.io-client'
import type { Message } from '@weave/types'

class SocketService {
  private socket: Socket | null = null
  private currentWorldId: string | null = null
  private currentChannelId: string | null = null

  connect(username: string = '玩家') {
    if (this.socket?.connected) return

    this.socket = io('http://localhost:3001')

    this.socket.on('connect', () => {
      console.log('Connected to server')
      this.socket?.emit('user:join', { username })
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Message operations
  sendMessage(
    channelId: string,
    worldId: string,
    content: string,
    characterName?: string
  ) {
    this.socket?.emit('message:send', {
      channelId,
      worldId,
      content,
      characterName,
    })
  }

  onNewMessage(callback: (message: Message) => void) {
    this.socket?.on('message:new', callback)
  }

  onMessageHistory(callback: (messages: Message[]) => void) {
    this.socket?.on('messages:history', callback)
  }

  // Remove event listeners
  off(event: string, callback?: (...args: unknown[]) => void) {
    this.socket?.off(event, callback)
  }
}

export const socketService = new SocketService()
