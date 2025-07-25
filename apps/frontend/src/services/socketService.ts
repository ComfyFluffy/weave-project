import { io, Socket } from 'socket.io-client'
import type { Message, World } from '@weave/types'

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

  // World operations
  joinWorld(worldId: string) {
    if (this.currentWorldId !== worldId) {
      this.currentWorldId = worldId
      this.socket?.emit('world:join', worldId)
    }
  }

  onWorldData(callback: (world: World) => void) {
    this.socket?.on('world:data', callback)
  }

  // Channel operations
  joinChannel(channelId: string) {
    if (this.currentChannelId) {
      this.socket?.emit('channel:leave', this.currentChannelId)
    }
    this.currentChannelId = channelId
    this.socket?.emit('channel:join', channelId)
  }

  leaveChannel() {
    if (this.currentChannelId) {
      this.socket?.emit('channel:leave', this.currentChannelId)
      this.currentChannelId = null
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

  // Typing indicators
  startTyping(channelId: string) {
    this.socket?.emit('typing:start', channelId)
  }

  stopTyping(channelId: string) {
    this.socket?.emit('typing:stop', channelId)
  }

  onUserTyping(
    callback: (data: {
      userId: string
      username: string
      typing: boolean
    }) => void
  ) {
    this.socket?.on('typing:user', callback)
  }

  // Remove event listeners
  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback)
  }
}

export const socketService = new SocketService()
