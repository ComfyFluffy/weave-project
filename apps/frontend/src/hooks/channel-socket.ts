import { useEffect, useRef, useCallback } from 'react'
import { socketService } from '../services/socket'
import type { Message } from '@weave/types'
import type { MessageSendInput } from '@weave/types/apis'

interface UseChannelSocketOptions {
  channelId: string | null
  onNewMessage?: (message: Message) => void
}

export function useChannelSocket({
  channelId,
  onNewMessage,
}: UseChannelSocketOptions) {
  const currentChannelRef = useRef<string | null>(null)
  const messageHandlerRef = useRef<((message: Message) => void) | null>(null)

  // Store the message handler ref to handle cleanup properly
  useEffect(() => {
    messageHandlerRef.current = onNewMessage || null
  }, [onNewMessage])

  // Handle channel joining/leaving
  useEffect(() => {
    if (!channelId) return

    const previousChannel = currentChannelRef.current

    console.log(
      'useChannelSocket: Channel changed from',
      previousChannel,
      'to',
      channelId
    )

    // Leave previous channel if it exists
    if (previousChannel && previousChannel !== channelId) {
      console.log('useChannelSocket: Leaving channel', previousChannel)
      socketService.leaveChannel(previousChannel)
    }

    // Join new channel
    console.log('useChannelSocket: Joining channel', channelId)
    socketService.joinChannel(channelId)
    currentChannelRef.current = channelId

    // Set up message listener for this channel
    const messageHandler = (message: Message) => {
      console.log(
        'useChannelSocket: Received message for channel',
        message.channelId
      )
      if (messageHandlerRef.current) {
        messageHandlerRef.current(message)
      }
    }

    socketService.onNewMessage(messageHandler)

    // Cleanup function
    return () => {
      console.log('useChannelSocket: Cleanup - leaving channel', channelId)
      if (channelId) {
        socketService.leaveChannel(channelId)
      }
      socketService.off('message:new', messageHandler)
      currentChannelRef.current = null
    }
  }, [channelId])

  // Send message function
  const sendMessage = useCallback((message: MessageSendInput) => {
    console.log(
      'useChannelSocket: Sending message to channel',
      message.channelId
    )
    socketService.sendMessage(message)
  }, [])

  return {
    sendMessage,
    isConnected: socketService.socket?.connected || false,
  }
}
