import { Box, Flex, Text, Input, IconButton, Badge } from '@chakra-ui/react'
import { Send, Smile, Plus, Hash } from 'lucide-react'
import { useState } from 'react'
import { MessageList } from './MessageList'
import type { Message, Channel } from '@weave/types'

interface ChatAreaProps {
  channel?: Channel
  messages?: Message[]
  onSendMessage?: (content: string) => void
}

export function ChatArea({
  channel,
  messages = [],
  onSendMessage,
}: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState('')

  // Default fallback channel
  const currentChannel: Channel = channel || {
    id: 'no-channel',
    name: '选择一个频道',
    type: 'ooc',
    description: '请从左侧选择一个频道开始对话',
    readonly: true,
  }

  const handleSendMessage = () => {
    if (messageInput.trim() && onSendMessage && !currentChannel.readonly) {
      onSendMessage(messageInput.trim())
      setMessageInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Flex direction="column" flex={1} bg="gray.700">
      {/* Channel Header */}
      <Box p={4} borderBottom="1px solid" borderColor="gray.600" bg="gray.750">
        <Flex align="center" gap={2}>
          <Hash size={20} color="#9ca3af" />
          <Text fontWeight="bold" color="white" fontSize="lg">
            {currentChannel.name}
          </Text>
          {currentChannel.readonly && (
            <Badge bg="yellow.600" color="white" size="sm">
              只读
            </Badge>
          )}
        </Flex>
        {currentChannel.description && (
          <Text color="gray.400" fontSize="sm" mt={1}>
            {currentChannel.description}
          </Text>
        )}
      </Box>

      {/* Messages Area */}
      <Box flex={1} overflow="hidden">
        <MessageList messages={messages} />
      </Box>

      {/* Message Input */}
      {!currentChannel.readonly && (
        <Box p={4}>
          <Flex gap={2} align="flex-end">
            <IconButton
              size="sm"
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'white', bg: 'gray.600' }}
            >
              <Plus size={20} />
            </IconButton>

            <Box flex={1} position="relative">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`在 #${currentChannel.name} 中发送消息`}
                bg="gray.600"
                border="none"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _focus={{
                  bg: 'gray.600',
                  boxShadow: '0 0 0 1px #3b82f6',
                }}
                pr={16}
              />
              <Flex
                position="absolute"
                right={2}
                top="50%"
                transform="translateY(-50%)"
                gap={1}
              >
                <IconButton
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: 'white' }}
                >
                  <Smile size={16} />
                </IconButton>
                <IconButton
                  size="sm"
                  variant="ghost"
                  color={messageInput.trim() ? 'blue.400' : 'gray.400'}
                  _hover={{
                    color: messageInput.trim() ? 'blue.300' : 'gray.300',
                  }}
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send size={16} />
                </IconButton>
              </Flex>
            </Box>
          </Flex>
        </Box>
      )}
    </Flex>
  )
}
