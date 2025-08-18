import { io, Socket } from 'socket.io-client'
import type { Message } from '@weave/types'
import type { MessageSendInput } from '@weave/types/apis'

export class SocketService {
  socket: Socket

  constructor() {
    this.socket = io('http://localhost:3001')

    this.socket.on('connect', () => {
      console.log('Connected to server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
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
}

export const socketService = new SocketService()
