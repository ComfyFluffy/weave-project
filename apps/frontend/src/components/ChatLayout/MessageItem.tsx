import { Box, Text, Avatar, Flex, Badge } from '@chakra-ui/react'
import {
  getMessageColor,
  getAuthorColor,
  formatTimestamp,
} from '../../utils/ui'
import type { Message } from '@weave/types'

interface MessageItemProps {
  message: Message
  showAvatar: boolean
}

export function MessageItem({ message, showAvatar }: MessageItemProps) {
  if (showAvatar) {
    return (
      <Flex gap={3} py={2}>
        <Avatar.Root size="sm" bg={getAuthorColor(message.type)}>
          <Avatar.Fallback name={message.authorName} />
        </Avatar.Root>
        <Box flex={1}>
          <MessageHeader message={message} />
          <MessageContent content={message.content} />
        </Box>
      </Flex>
    )
  }

  return (
    <Flex gap={3} py={0.5}>
      <Box width="40px" /> {/* Avatar placeholder */}
      <Box flex={1}>
        <MessageContent content={message.content} />
      </Box>
    </Flex>
  )
}

function MessageHeader({ message }: { message: Message }) {
  return (
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
      {message.type !== 'user' && <MessageTypeBadge type={message.type} />}
    </Flex>
  )
}

function MessageContent({ content }: { content: string }) {
  return (
    <Text color="gray.200" fontSize="sm" lineHeight="1.4">
      {content}
    </Text>
  )
}

function MessageTypeBadge({ type }: { type: string }) {
  const getTypeLabel = (type: string) => {
    const labels = {
      system: '系统',
      ai: 'AI',
      action: '动作',
    }
    return labels[type as keyof typeof labels] || ''
  }

  return (
    <Badge size="xs" bg={getAuthorColor(type)} color="white">
      {getTypeLabel(type)}
    </Badge>
  )
}
