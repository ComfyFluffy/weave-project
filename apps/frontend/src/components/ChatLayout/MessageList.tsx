import { VStack, Box } from '@chakra-ui/react'
import { shouldShowAvatar } from '../../utils/ui'
import { MESSAGE_GROUPING_TIME_THRESHOLD } from '../../constants/ui'
import { MessageItem } from './MessageItem'
import type { Message } from '@weave/types'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <Box height="100%" overflowY="auto">
      <VStack gap={0} align="stretch" p={4}>
        {messages.map((message, index) => {
          const prevMessage = index > 0 ? messages[index - 1] : null
          const showAvatar = shouldShowAvatar(
            message,
            prevMessage,
            MESSAGE_GROUPING_TIME_THRESHOLD
          )

          return (
            <Box key={message.id}>
              <MessageItem message={message} showAvatar={showAvatar} />
            </Box>
          )
        })}
      </VStack>
    </Box>
  )
}
