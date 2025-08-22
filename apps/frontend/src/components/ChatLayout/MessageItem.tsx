import { Box, Text, Avatar, Flex, Badge } from '@chakra-ui/react'
import {
  getMessageColor,
  getAuthorColor,
  formatTimestamp,
} from '../../utils/ui'
import { MemoizedMarkdown } from '../MemoizedMarkdown'
import { useUser, useCharacter } from '../../hooks/queries'
import type { Message, PublicUser, Character } from '@weave/types'

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
  const { data: userResponse, isPending: isUserPending } = useUser(
    message.userId
  )
  const { data: characterResponse, isPending: isCharacterPending } =
    useCharacter(message.characterId)
  const isPending = isUserPending || isCharacterPending

  const user = userResponse?.status === 200 ? userResponse.body.user : null
  const character =
    characterResponse?.status === 200 ? characterResponse.body.character : null

  // 当需要显示头像时的布局
  if (showAvatar) {
    return (
      <Flex gap={3} pb={2} css={fadeInAnimation}>
        {/* 用户头像组件，根据消息类型设置不同背景色 */}
        <MessageAvatar message={message} user={user} character={character} />
        {/* 消息内容容器 */}
        <Box flex={1}>
          {/* 消息头部：显示用户名和时间戳 */}
          <MessageHeader
            message={message}
            user={user}
            character={character}
            isPending={isPending}
          />
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
      <Box width="36px" /> {/* Avatar placeholder */}
      <Box flex={1}>
        {/* 只显示消息内容 */}
        <MessageContent message={message} />
      </Box>
    </Flex>
  )
}

function MessageAvatar({
  message,
  user,
  character,
}: {
  message: Message
  user: PublicUser | null | undefined
  character: Character | null | undefined
}) {
  // 确定头像显示的内容和背景色
  let avatarContent = '?'
  let avatarName = 'Unknown'

  if (message.type === 'system') {
    avatarContent = '⚙️'
    avatarName = 'System'
  } else if (character) {
    avatarContent = character.avatar || character.name[0]
    avatarName = character.name
  } else if (user) {
    avatarContent = user.avatar || user.displayName[0]
    avatarName = user.displayName
  } else if (message.type === 'gm') {
    avatarContent = '🎭'
    avatarName = 'GM'
  }

  return (
    <Avatar.Root size="sm" bg={getAuthorColor(message.type)}>
      <Avatar.Fallback name={avatarName}>{avatarContent}</Avatar.Fallback>
    </Avatar.Root>
  )
}

function MessageHeader({
  message,
  user,
  character,
  isPending,
}: {
  message: Message
  user: PublicUser | null | undefined
  character: Character | null | undefined
  isPending: boolean
}) {
  // 确定显示的名称
  let displayName = 'Unknown'
  let displaySubtitle = ''

  if (message.type === 'system') {
    displayName = 'System'
  } else if (character) {
    displayName = character.name
    if (user) {
      displaySubtitle = `(${user.displayName})`
    }
  } else if (user) {
    displayName = user.displayName
  } else if (message.type === 'gm') {
    displayName = 'Game Master'
  } else if (isPending) {
    displayName = 'Loading...'
  }

  return (
    <Flex align="baseline" gap={2} mb={1}>
      {/* 发送者名称，根据消息类型设置不同颜色 */}
      <Text
        color={getMessageColor(message.type)}
        fontSize="sm"
        fontWeight="bold"
      >
        {displayName}
        {displaySubtitle && (
          <Text as="span" color="gray.400" fontWeight="normal" ml={1}>
            {displaySubtitle}
          </Text>
        )}
      </Text>
      {/* 消息创建时间戳 */}
      <Text color="gray.400" fontSize="xs">
        {formatTimestamp(message.createdAt)}
      </Text>
      {message.type !== 'system' && <MessageTypeBadge type={message.type} />}
    </Flex>
  )
}
function MessageContent({ message }: { message: Message }) {
  return (
    <Box color="gray.200" fontSize="sm" lineHeight="1.4">
      {/* 使用统一的 Markdown 渲染器渲染内容 */}
      <MemoizedMarkdown content={message.content} id={message.id} />
    </Box>
  )
}

function MessageTypeBadge({ type }: { type: string }) {
  // 消息类型对应的中文标签
  const labels: Record<string, string> = {
    system: '系统',
    gm: 'GM',
    character: '角色',
    action: '动作',
  }

  const label = labels[type]

  if (!label) return null

  return (
    <Badge size="xs" bg={getAuthorColor(type)} color="white">
      {label}
    </Badge>
  )
}
