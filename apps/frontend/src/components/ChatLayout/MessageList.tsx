import { VStack, Box } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { shouldShowAvatar } from '../../utils/ui'
import { MESSAGE_GROUPING_TIME_THRESHOLD } from '../../constants/ui'
import { MessageItem } from './MessageItem'
import type { Message } from '@weave/types'

interface MessageListProps {
  messages: Message[]
}

/**
 * 消息列表组件 - 负责渲染聊天消息列表
 * 自动滚动到底部以显示最新消息
 * 根据时间间隔和发送者决定是否显示用户头像
 */
export function MessageList({ messages }: MessageListProps) {
  // 用于滚动到底部的引用
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // 消息容器引用，用于滚动控制
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 当消息变化时自动滚动到底部
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  /**
   * 滚动到消息列表底部
   * 使用平滑滚动效果提升用户体验
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  return (
    <Box
      height="100%"
      overflowY="auto"
      ref={containerRef}
    >
      {/* 消息容器，使用垂直堆叠布局 */}
      <VStack gap={0} align="stretch" p={4}>
        {/* 遍历所有消息并渲染 */}
        {messages.map((message, index) => {
          // 获取前一条消息用于比较
          const prevMessage = index > 0 ? messages[index - 1] : null
          // 根据消息间隔时间和发送者决定是否显示头像
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
        {/* 用于滚动定位的空元素 */}
        <div ref={messagesEndRef} />
      </VStack>
    </Box>
  )
}
