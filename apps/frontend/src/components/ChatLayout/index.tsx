import { Flex } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { WorldSidebar } from './WorldSidebar'
import { ChannelSidebar } from './ChannelSidebar'
import { ChatArea } from './ChatArea'
import { MemberList } from './MemberList'
import { socketService } from '../../services/socketService'
import { useWorlds, useWorld, useChannelMessages } from '../../hooks/useQueries'
import type { World, Channel, Message, WorldMember } from '@weave/types'

export function ChatLayout() {
  const [selectedWorldId, setSelectedWorldId] = useState<string>('')
  const [selectedChannelId, setSelectedChannelId] = useState<string>('')
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  // Use React Query hooks for data fetching
  const { data: worlds = [], isLoading: worldsLoading } = useWorlds()
  const { data: currentWorld } = useWorld(selectedWorldId)
  const { data: messages = [], refetch: refetchMessages } = useChannelMessages(selectedChannelId)

  const currentChannel = currentWorld?.channels.find(
    (c) => c.id === selectedChannelId
  )

  // Initialize socket connection and auto-select world/channel
  useEffect(() => {
    // Connect to socket
    socketService.connect('玩家')

    // Auto-select first world if available
    if (worlds.length > 0 && !selectedWorldId) {
      setSelectedWorldId(worlds[0].id)
    }

    // Setup socket event listeners
    socketService.onNewMessage((message: Message) => {
      // Refetch messages when new message arrives
      refetchMessages()
    })

    socketService.onMessageHistory((messageHistory: Message[]) => {
      // Refetch messages when history is updated
      refetchMessages()
    })

    socketService.onUserTyping((data) => {
      setTypingUsers((prev) => {
        if (data.typing) {
          return [...prev.filter((u) => u !== data.username), data.username]
        } else {
          return prev.filter((u) => u !== data.username)
        }
      })
    })

    // Cleanup on unmount
    return () => {
      socketService.disconnect()
    }
  }, [worlds, selectedWorldId, refetchMessages])

  // Auto-select first channel when world data changes
  useEffect(() => {
    if (currentWorld?.channels.length && !selectedChannelId) {
      setSelectedChannelId(currentWorld.channels[0].id)
    }
  }, [currentWorld, selectedChannelId])

  // Handle world selection
  useEffect(() => {
    if (selectedWorldId) {
      socketService.joinWorld(selectedWorldId)
    }
  }, [selectedWorldId])

  // Handle channel selection
  useEffect(() => {
    if (selectedChannelId) {
      socketService.joinChannel(selectedChannelId)
      setTypingUsers([]) // Clear typing indicators
      refetchMessages() // Refresh messages for the new channel
    }
  }, [selectedChannelId, refetchMessages])

  const handleWorldSelect = (worldId: string) => {
    setSelectedWorldId(worldId)
    setSelectedChannelId('') // Reset channel when world changes
  }

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId)
  }

  const handleSendMessage = (content: string) => {
    if (
      !currentChannel ||
      !currentWorld ||
      !selectedChannelId ||
      !selectedWorldId
    ) {
      return
    }

    // TODO: Get character name from user's current character
    const characterName = undefined // Will be implemented when we add character management

    socketService.sendMessage(
      selectedChannelId,
      selectedWorldId,
      content,
      characterName
    )
  }

  const handleCreateWorld = () => {
    // TODO: Implement world creation modal
    console.log('Create world clicked')
  }

  return (
    <Flex height="100vh" width="100vw" bg="gray.900">
      {/* World/Server List */}
      <WorldSidebar
        worlds={worlds}
        selectedWorldId={selectedWorldId}
        onWorldSelect={handleWorldSelect}
        onCreateWorld={handleCreateWorld}
      />

      {/* Channel List */}
      <ChannelSidebar
        worldName={currentWorld?.name}
        channels={currentWorld?.channels}
        selectedChannelId={selectedChannelId}
        onChannelSelect={handleChannelSelect}
      />

      {/* Main Chat Area */}
      <ChatArea
        channel={currentChannel}
        messages={messages}
        typingUsers={typingUsers}
        onSendMessage={handleSendMessage}
        onStartTyping={() =>
          selectedChannelId && socketService.startTyping(selectedChannelId)
        }
        onStopTyping={() =>
          selectedChannelId && socketService.stopTyping(selectedChannelId)
        }
      />

      {/* Member List */}
      <MemberList members={currentWorld?.members} />
    </Flex>
  )
}
