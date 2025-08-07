import { useState, useRef, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Textarea,
  IconButton,
  Avatar,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { Send, User, Bot } from 'lucide-react'
import { type Message } from '@ai-sdk/react'
import { useWorldChat } from '../services/aiService'
// 导入统一的Markdown组件，用于优化性能，避免重复渲染相同内容
import { UnifiedMarkdownRenderer } from './ChatLayout/UnifiedMarkdownRenderer'

interface AIChatSectionProps {
  worldId: string
  channelId: string
  selectedCharacterId?: string
  selectedRole?: string
}

export function AIChatSection({
  worldId,
  channelId,
  selectedCharacterId,
  selectedRole,
}: AIChatSectionProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, isLoading, append } = useWorldChat(
    worldId,
    channelId,
    selectedCharacterId,
    selectedRole
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    try {
      await append({
        role: 'user',
        content: userMessage,
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSubmit(e)
    }
  }

  return (
    <Box
      height="60%"
      bg="gray.900"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="md"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box
        p={3}
        borderBottom="1px solid"
        borderColor="gray.700"
        display="flex"
        alignItems="center"
        gap={2}
      >
        <Bot size={16} color="white" />
        <Text color="white" fontWeight="medium" fontSize="sm">
          AI 助手
        </Text>
      </Box>

      {/* Messages Area */}
      <Box
        flex={1}
        overflowY="auto"
        p={4}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.600',
            borderRadius: '24px',
          },
        }}
      >
        <VStack gap={4} align="stretch">
          {messages.length === 0 ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="200px"
              color="gray.400"
              fontSize="sm"
              textAlign="center"
            >
              开始与 AI 对话，探索游戏世界...
            </Box>
          ) : (
            messages.map((message, index) => (
              <MessageItem
                key={index}
                message={message}
                isLoading={isLoading && index === messages.length - 1}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input Area */}
      <Box
        p={4}
        borderTop="1px solid"
        borderColor="gray.700"
        bg="gray.800"
        borderBottomRadius="md"
      >
        <form
          onSubmit={(e) => {
            void handleSubmit(e)
          }}
        >
          <HStack gap={2}>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="询问 AI 关于游戏世界的任何问题..."
              bg="gray.700"
              border="1px solid"
              borderColor="gray.600"
              color="white"
              _placeholder={{ color: 'gray.400' }}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
              resize="none"
              rows={1}
            />
            <IconButton
              type="submit"
              size="md"
              colorScheme="blue"
              disabled={!input.trim() || isLoading}
              loading={isLoading}
            >
              <Send size={16} />
            </IconButton>
          </HStack>
        </form>
      </Box>
    </Box>
  )
}

interface MessageItemProps {
  message: Message
  isLoading?: boolean
}

function MessageItem({ message, isLoading }: MessageItemProps) {
  const isUser = message.role === 'user'

  return (
    <Flex
      direction="row"
      align="flex-start"
      gap={3}
      justify={isUser ? 'flex-end' : 'flex-start'}
    >
      {!isUser && (
        <Avatar.Root size="sm" bg="green.600">
          <Avatar.Fallback>
            <Bot size={16} />
          </Avatar.Fallback>
        </Avatar.Root>
      )}

      <Box
        maxWidth="75%"
        bg={isUser ? 'blue.600' : 'gray.700'}
        color="white"
        px={4}
        py={3}
        borderRadius="lg"
        borderTopLeftRadius={!isUser ? 'sm' : 'lg'}
        borderTopRightRadius={isUser ? 'sm' : 'lg'}
        position="relative"
      >
        {/* 使用统一的Markdown组件渲染AI回复的消息内容，提高渲染性能 */}
        <UnifiedMarkdownRenderer content={message.content} id={message.id} />

        {isLoading && !isUser && (
          <Flex align="center" gap={2} mt={2}>
            <Spinner size="xs" />
            <Text fontSize="xs" color="gray.300">
              AI 正在思考...
            </Text>
          </Flex>
        )}
      </Box>

      {isUser && (
        <Avatar.Root size="sm" bg="blue.600">
          <Avatar.Fallback>
            <User size={16} />
          </Avatar.Fallback>
        </Avatar.Root>
      )}
    </Flex>
  )
}
