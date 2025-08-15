import { Box, Text, Avatar, Flex, Badge, HStack } from '@chakra-ui/react'
import {
  getMessageColor,
  getAuthorColor,
  formatTimestamp,
} from '../../utils/ui'
import { MemoizedMarkdown } from '../MemoizedMarkdown'
import { Clipboard } from '../ui/clipboard'
import type { Message } from '@weave/types'
import { MessageType } from '@weave/types'

// 定义消息项组件的属性接口
// message: 消息对象，包含内容、类型、时间等信息
// showAvatar: 是否显示用户头像的布尔值
interface MessageItemProps {
  message: Message
  showAvatar: boolean
}

// 定义淡入动画样式常量，避免重复
const fadeInAnimation = {
  animation: 'fadeIn 0.3s ease-out',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
}

/**
 * 消息项组件 - 负责渲染单条聊天消息
 * 根据 showAvatar 属性决定是否显示用户头像
 * 支持不同类型的消息展示（用户、AI、系统消息等）
 * 使用统一的 Markdown 渲染器来处理消息内容
 */
export function MessageItem({ message, showAvatar }: MessageItemProps) {
  // 当需要显示头像时的布局
  if (showAvatar) {
    return (
      <Flex gap={3} py={2} css={fadeInAnimation}>
        {/* 用户头像组件，根据消息类型设置不同背景色 */}
        <Avatar.Root size="sm" bg={getAuthorColor(message.type)}>
          <Avatar.Fallback name={'User'} />
        </Avatar.Root>
        {/* 消息内容容器 */}
        <Box flex={1}>
          {/* 消息头部：显示用户名和时间戳 */}
          <MessageHeader message={message} />
          {/* 消息内容：使用统一的 Markdown 渲染器 */}
          <MessageContent message={message} />
        </Box>
      </Flex>
    )
  }

  // 不显示头像时的简化布局
  return (
    <Flex gap={3} py={0.5} css={fadeInAnimation}>
      {/* 头像占位符，保持布局一致性 */}
      <Box width="40px" /> {/* Avatar placeholder */}
      <Box flex={1}>
        {/* 只显示消息内容 */}
        <MessageContent message={message} />
      </Box>
    </Flex>
  )
}

function MessageHeader({ message }: { message: Message }) {
  return (
    <Flex align="baseline" gap={2} mb={1}>
      {/* 发送者名称，根据消息类型设置不同颜色 */}
      <Text
        color={getMessageColor(message.type)}
        fontSize="sm"
        fontWeight="bold"
      >
        {'User'}
      </Text>
      {/* 消息创建时间戳 */}
      <Text color="gray.400" fontSize="xs">
        {formatTimestamp(message.createdAt)}
      </Text>
      {message.type !== MessageType.SYSTEM && (
        <MessageTypeBadge type={message.type} />
      )}
    </Flex>
  )
}
function MessageContent({ message }: { message: Message }) {
  return (
    <Box color="gray.200" fontSize="sm" lineHeight="1.4">
      {/* 使用统一的 Markdown 渲染器渲染内容 */}
      <MemoizedMarkdown content={message.content} id={message.id} />
      {/* 复制按钮 */}
      <HStack justify="flex-end" mt={2}>
        <Clipboard
          text={message.content}
          variant="icon"
          size="sm"
          tooltip="Copy message"
        />
      </HStack>
    </Box>
  )
}

function MessageTypeBadge({ type }: { type: string }) {
  // 消息类型对应的中文标签
  const labels: Record<string, string> = {
    system: '系统',
    ai: 'AI',
    action: '动作',
  }

  return (
    <Badge size="xs" bg={getAuthorColor(type)} color="white">
      {labels[type] || ''}
    </Badge>
  )
}
