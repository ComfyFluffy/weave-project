import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  Button,
  Menu,
  Portal,
} from '@chakra-ui/react'
import { Send, Plus, Hash, User } from 'lucide-react'
import { useState } from 'react'
// 导入消息列表组件，该组件负责渲染消息内容，包括Markdown格式的消息
import { MessageList } from './MessageList'
import type { Message, Channel, Character } from '@weave/types'
import type { UserRole } from '../RoleSelector'

interface ChatAreaProps {
  channel?: Channel
  messages?: Message[]
  selectedRole: UserRole
  worldCharacters?: Character[]
  selectedCharacter?: Character | null
  onSendMessage?: (content: string) => void
  onSelectCharacter?: (character: Character | null) => void
  onOpenCharacterModal?: () => void
}

export function ChatArea({
  channel,
  messages = [],
  selectedRole,
  worldCharacters = [],
  selectedCharacter,
  onSendMessage,
  onSelectCharacter,
  onOpenCharacterModal,
}: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState('')

  // 默认频道，当没有选择频道时显示
  const currentChannel: Channel = channel || {
    id: 'no-channel',
    worldId: '',
    name: '选择一个频道',
    type: 'OOC',
    description: '请从左侧选择一个频道开始对话',
    worldStateId: '',
  }

  // 处理输入框内容变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value)
  }

  // 发送消息处理函数
  const handleSendMessage = () => {
    if (messageInput.trim() && onSendMessage) {
      // 调用父组件传递的发送消息函数
      onSendMessage(messageInput.trim())
      setMessageInput('')
    }
  }

  // 处理键盘事件，回车发送消息
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Flex direction="column" flex={1} bg="gray.700">
      {/* 频道头部信息 */}
      <Box p={4} borderBottom="1px solid" borderColor="gray.600" bg="gray.750">
        <Flex align="center" gap={2}>
          <Hash size={20} color="#9ca3af" />
          <Text fontWeight="bold" color="white" fontSize="lg">
            {currentChannel.name}
          </Text>
        </Flex>
        {currentChannel.description && (
          <Text color="gray.400" fontSize="sm" mt={1}>
            {currentChannel.description}
          </Text>
        )}
      </Box>

      {/* 消息显示区域，使用MessageList组件渲染消息内容，包括Markdown格式的消息 */}
      <Box flex={1} overflow="hidden">
        <MessageList messages={messages} />
      </Box>

      {/* 消息输入区域 */}
      {selectedRole !== 'spectator' && (
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

            {/* 角色选择器 - 为游戏主持人角色修改 */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ bg: 'gray.600' }}
                  minWidth="120px"
                  justifyContent="flex-start"
                >
                  <User size={16} />{' '}
                  {selectedRole === 'gm'
                    ? selectedCharacter
                      ? selectedCharacter.name
                      : '游戏主持人'
                    : selectedCharacter
                      ? selectedCharacter.name
                      : '选择角色'}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content bg="gray.800" borderColor="gray.600">
                    {/* 游戏主持人可以不选择角色直接发布消息 */}
                    {selectedRole === 'gm' && (
                      <Menu.Item
                        value="gm"
                        bg="gray.800"
                        _hover={{ bg: 'gray.700' }}
                        color="yellow.400"
                        onClick={() => onSelectCharacter?.(null)}
                      >
                        <Flex align="center">
                          <Text>游戏主持人</Text>
                        </Flex>
                      </Menu.Item>
                    )}

                    {worldCharacters.map((character) => (
                      <Menu.Item
                        key={character.id}
                        value={character.id}
                        bg="gray.800"
                        _hover={{ bg: 'gray.700' }}
                        color="white"
                        onClick={() => onSelectCharacter?.(character)}
                      >
                        <Flex
                          align="center"
                          justify="space-between"
                          width="100%"
                        >
                          <Text>{character.name}</Text>
                          <Text fontSize="xs" color="gray.400">
                            {character.description}
                          </Text>
                        </Flex>
                      </Menu.Item>
                    ))}

                    {/* 仅允许玩家和游戏主持人创建角色 */}
                    {(selectedRole === 'player' || selectedRole === 'gm') && (
                      <Menu.Item
                        value="create-new"
                        bg="gray.800"
                        _hover={{ bg: 'gray.700' }}
                        color="blue.400"
                        onClick={() => onOpenCharacterModal?.()}
                      >
                        <Flex align="center">
                          <Plus size={16} />
                          <Text ml={2}>创建新角色</Text>
                        </Flex>
                      </Menu.Item>
                    )}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            <Box flex={1} position="relative">
              <Input
                value={messageInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={
                  selectedRole === 'gm'
                    ? `以主持人身份在 #${currentChannel.name} 中发送消息`
                    : `在 #${currentChannel.name} 中发送消息`
                }
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
                  color={messageInput.trim() ? 'blue.400' : 'gray.400'}
                  _hover={{
                    color: messageInput.trim() ? 'blue.300' : 'gray.300',
                  }}
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  css={{
                    transition: 'all 0.2s ease-in-out',
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                  }}
                >
                  <Send size={16} />
                </IconButton>
              </Flex>
            </Box>
          </Flex>
        </Box>
      )}

      {/* 观察者模式提示 */}
      {selectedRole === 'spectator' && (
        <Box p={4} bg="gray.750" borderTop="1px solid" borderColor="gray.700">
          <Text color="gray.400" fontSize="sm" textAlign="center">
            观察者模式 - 您只能查看消息，无法发送消息
          </Text>
        </Box>
      )}
    </Flex>
  )
}
