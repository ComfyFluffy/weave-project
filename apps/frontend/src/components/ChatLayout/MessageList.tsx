import { VStack, Box, Text, Avatar, Flex, Badge } from '@chakra-ui/react'
import type { Message } from '@weave/types'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const getMessageColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'blue.400'
      case 'ai':
        return 'purple.400'
      case 'action':
        return 'green.400'
      default:
        return 'white'
    }
  }

  const getAuthorColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'blue.500'
      case 'ai':
        return 'purple.500'
      case 'action':
        return 'green.500'
      default:
        return 'gray.500'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    try {
      const now = new Date()
      const messageTime = new Date(timestamp)
      const diffInMinutes = Math.floor(
        (now.getTime() - messageTime.getTime()) / (1000 * 60)
      )

      if (diffInMinutes < 1) return '刚刚'
      if (diffInMinutes < 60) return `${diffInMinutes}分钟前`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`
      return `${Math.floor(diffInMinutes / 1440)}天前`
    } catch {
      return '刚刚'
    }
  }

  return (
    <Box height="100%" overflowY="auto">
      <VStack gap={0} align="stretch" p={4}>
        {messages.map((message, index) => {
          const prevMessage = index > 0 ? messages[index - 1] : null
          const showAvatar =
            !prevMessage ||
            prevMessage.authorId !== message.authorId ||
            new Date(message.timestamp).getTime() -
              new Date(prevMessage.timestamp).getTime() >
              300000 // 5 minutes

          return (
            <Box key={message.id}>
              {showAvatar ? (
                <Flex gap={3} py={2}>
                  <Avatar.Root size="sm" bg={getAuthorColor(message.type)}>
                    <Avatar.Fallback name={message.authorName} />
                  </Avatar.Root>
                  <Box flex={1}>
                    <Flex align="baseline" gap={2} mb={1}>
                      <Text
                        color={getMessageColor(message.type)}
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        {message.characterName
                          ? `${message.characterName} (${message.authorName})`
                          : message.authorName}
                      </Text>
                      <Text color="gray.400" fontSize="xs">
                        {formatTimestamp(message.timestamp)}
                      </Text>
                      {message.type !== 'user' && (
                        <Badge
                          size="xs"
                          bg={getAuthorColor(message.type)}
                          color="white"
                        >
                          {message.type === 'system'
                            ? '系统'
                            : message.type === 'ai'
                              ? 'AI'
                              : message.type === 'action'
                                ? '动作'
                                : ''}
                        </Badge>
                      )}
                    </Flex>
                    <Text color="gray.200" fontSize="sm" lineHeight="1.4">
                      {message.content}
                    </Text>
                  </Box>
                </Flex>
              ) : (
                <Flex gap={3} py={0.5}>
                  <Box width="40px" /> {/* Avatar placeholder */}
                  <Box flex={1}>
                    <Text color="gray.200" fontSize="sm" lineHeight="1.4">
                      {message.content}
                    </Text>
                  </Box>
                </Flex>
              )}
            </Box>
          )
        })}
      </VStack>
    </Box>
  )
}
