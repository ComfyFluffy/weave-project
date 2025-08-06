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

  // Default fallback channel
  const currentChannel: Channel = channel || {
    id: 'no-channel',
    worldId: '',
    name: '选择一个频道',
    type: 'ooc',
    description: '请从左侧选择一个频道开始对话',
    worldStateId: '',
    createdAt: new Date(),
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value)
  }

  const handleSendMessage = () => {
    if (messageInput.trim() && onSendMessage) {
      onSendMessage(messageInput.trim())
      setMessageInput('')
    }
  }

  // Remove unused suggestion handler for now
  // const handleUseSuggestion = (suggestion: string) => {
  //   setMessageInput(suggestion)
  // }

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

            {/* Character Selector - Modified for GM role */}
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
                    {/* GM can post as GM without character */}
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

                    {/* Only allow character creation for players and GMs */}
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
                >
                  <Send size={16} />
                </IconButton>
              </Flex>
            </Box>
          </Flex>
        </Box>
      )}

      {/* Spectator notice */}
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
