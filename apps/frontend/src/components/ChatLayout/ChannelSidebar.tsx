import {
  VStack,
  Box,
  Text,
  Button,
  Flex,
  Menu,
  Portal,
  IconButton,
} from '@chakra-ui/react'
import {
  Hash,
  Volume2,
  Settings,
  MessageSquare,
  Sword,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import type { Channel } from '@weave/types'
import { CreateChannelModal } from '../CreateChannelModal'
import { RoleSelector, type UserRole } from '../RoleSelector'
import { useDeleteChannel } from '../../hooks/useChannels'

interface ChannelSidebarProps {
  worldId?: string
  worldName?: string
  channels?: Channel[]
  selectedChannelId?: string
  selectedRole: UserRole
  onChannelSelect?: (channelId: string) => void
  onRoleChange: (role: UserRole) => void
}

const channelIcons = {
  announcement: Volume2,
  ooc: MessageSquare,
  ic: Sword,
}

export function ChannelSidebar({
  worldId,
  worldName = '选择一个世界',
  channels = [],
  selectedChannelId,
  selectedRole,
  onChannelSelect,
  onRoleChange,
}: ChannelSidebarProps) {
  const deleteChannelMutation = useDeleteChannel(worldId || '')

  const handleDeleteChannel = async (channelId: string) => {
    if (!worldId) return

    try {
      await deleteChannelMutation.mutateAsync(channelId)
    } catch (error) {
      console.error('Failed to delete channel:', error)
    }
  }

  return (
    <Box
      width="240px"
      bg="gray.800"
      borderRight="1px solid"
      borderColor="gray.700"
      flexShrink={0}
      display="flex"
      flexDirection="column"
    >
      {/* World Header */}
      <Box
        p={4}
        borderBottom="1px solid"
        borderColor="gray.700"
        cursor="pointer"
        _hover={{ bg: 'gray.750' }}
        transition="background 0.2s"
      >
        <Flex align="center" justify="space-between">
          <Text fontWeight="bold" color="white" fontSize="md">
            {worldName}
          </Text>
          <Settings size={16} color="#9ca3af" />
        </Flex>
      </Box>

      {/* Channel List */}
      <Box flex={1} overflowY="auto">
        <VStack gap={0} align="stretch" p={2}>
          {/* Channels Header */}
          <Flex align="center" justify="space-between" px={2} py={1}>
            <Text
              color="gray.400"
              fontSize="xs"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="0.5px"
            >
              频道
            </Text>
            {worldId && selectedRole === 'gm' && (
              <CreateChannelModal worldId={worldId} />
            )}
          </Flex>

          {/* Channel List */}
          <VStack gap={0} align="stretch">
            {channels.map((channel) => {
              const IconComponent = channelIcons[channel.type] || Hash
              const isSelected = selectedChannelId === channel.id

              return (
                <Flex key={channel.id} align="center" width="full">
                  <Button
                    variant="ghost"
                    size="sm"
                    width="full"
                    justifyContent="flex-start"
                    color={isSelected ? 'white' : 'gray.300'}
                    bg={isSelected ? 'gray.600' : 'transparent'}
                    fontSize="sm"
                    fontWeight="normal"
                    py={1}
                    px={2}
                    _hover={{
                      bg: isSelected ? 'gray.600' : 'gray.700',
                      color: 'white',
                    }}
                    onClick={() => onChannelSelect?.(channel.id)}
                  >
                    <Flex align="center" justify="space-between" width="full">
                      <Flex align="center" gap={2}>
                        <IconComponent
                          size={16}
                          color={isSelected ? 'white' : '#9ca3af'}
                        />
                        <Text>{channel.name}</Text>
                      </Flex>
                      {selectedRole === 'gm' && (
                        <Menu.Root>
                          <Menu.Trigger asChild>
                            <IconButton
                              variant="ghost"
                              size="sm"
                              color="gray.400"
                              _hover={{ color: 'white', bg: 'gray.700' }}
                              p={1}
                              minW="auto"
                              height="auto"
                            >
                              <MoreHorizontal />
                            </IconButton>
                          </Menu.Trigger>
                          <Portal>
                            <Menu.Positioner>
                              <Menu.Content>
                                <Menu.Item
                                  value="delete-channel"
                                  onClick={() =>
                                    void handleDeleteChannel(channel.id)
                                  }
                                  color="red.400"
                                  _hover={{ bg: 'red.600', color: 'white' }}
                                >
                                  <Trash2 size={14} />
                                  <Text>删除频道</Text>
                                </Menu.Item>
                              </Menu.Content>
                            </Menu.Positioner>
                          </Portal>
                        </Menu.Root>
                      )}
                    </Flex>
                  </Button>
                </Flex>
              )
            })}
          </VStack>
        </VStack>
      </Box>

      {/* Role Selector */}
      <RoleSelector selectedRole={selectedRole} onRoleChange={onRoleChange} />
    </Box>
  )
}
