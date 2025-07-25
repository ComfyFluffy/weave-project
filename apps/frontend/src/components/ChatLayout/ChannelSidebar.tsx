import {
  VStack,
  Box,
  Text,
  Button,
  Flex,
  Collapsible,
  Badge,
} from '@chakra-ui/react'
import {
  Hash,
  Volume2,
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  BookOpen,
  MessageSquare,
  Sword,
} from 'lucide-react'
import { useState } from 'react'
import type { Channel } from '@weave/types'

interface ChannelSidebarProps {
  worldName?: string
  channels?: Channel[]
  selectedChannelId?: string
  onChannelSelect?: (channelId: string) => void
}

const channelIcons = {
  announcement: Volume2,
  rules: BookOpen,
  'character-creation': Users,
  ooc: MessageSquare,
  ic: Sword,
}

export function ChannelSidebar({
  worldName = '选择一个世界',
  channels = [],
  selectedChannelId,
  onChannelSelect,
}: ChannelSidebarProps) {
  const [textChannelsOpen, setTextChannelsOpen] = useState(true)

  return (
    <Box
      width="240px"
      bg="gray.800"
      borderRight="1px solid"
      borderColor="gray.700"
      flexShrink={0}
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

      {/* Channel Categories */}
      <VStack gap={0} align="stretch" p={2}>
        {/* Text Channels Section */}
        <Box>
          <Collapsible.Root open={textChannelsOpen}>
            <Collapsible.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                width="full"
                justifyContent="flex-start"
                color="gray.400"
                fontSize="xs"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="0.5px"
                py={1}
                px={2}
                _hover={{ color: 'gray.300' }}
                onClick={() => setTextChannelsOpen(!textChannelsOpen)}
              >
                <Flex align="center" gap={1}>
                  {textChannelsOpen ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
                  文字频道
                </Flex>
              </Button>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <VStack gap={0} align="stretch" pl={2}>
                {channels.map((channel) => {
                  const IconComponent = channelIcons[channel.type] || Hash
                  const isSelected = selectedChannelId === channel.id

                  return (
                    <Button
                      key={channel.id}
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
                        {channel.readonly && (
                          <Badge size="xs" bg="yellow.600" color="white">
                            只读
                          </Badge>
                        )}
                      </Flex>
                    </Button>
                  )
                })}
              </VStack>
            </Collapsible.Content>
          </Collapsible.Root>
        </Box>
      </VStack>
    </Box>
  )
}
