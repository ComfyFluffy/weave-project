import {
  Box,
  VStack,
  Text,
  Avatar,
  Flex,
  Badge,
  IconButton,
} from '@chakra-ui/react'
import { Settings } from 'lucide-react'
import { getRoleColor, getRoleLabel, getStatusColor } from '../../utils/ui'
import type { WorldMember } from '@weave/types'

interface MemberListProps {
  members?: WorldMember[]
  onOpenCharacterManagement?: () => void
}

export function MemberList({
  members = [],
  onOpenCharacterManagement,
}: MemberListProps) {
  return (
    <Box
      width="240px"
      bg="gray.800"
      borderLeft="1px solid"
      borderColor="gray.700"
      flexShrink={0}
    >
      {/* Header */}
      <Box p={4} borderBottom="1px solid" borderColor="gray.700">
        <Flex align="center" justify="space-between">
          <Text fontWeight="bold" color="white" fontSize="md">
            成员 — {members.length}
          </Text>
          <IconButton
            size="sm"
            variant="ghost"
            color="gray.400"
            _hover={{ color: 'white', bg: 'gray.700' }}
            onClick={onOpenCharacterManagement}
            title="角色管理"
          >
            <Settings size={16} />
          </IconButton>
        </Flex>
      </Box>

      {/* Members List */}
      <Box height="calc(100vh - 81px)" overflowY="auto">
        <VStack gap={0} align="stretch" p={2}>
          {members.map((member) => (
            <Box
              key={member.id}
              p={2}
              borderRadius="md"
              _hover={{ bg: 'gray.700' }}
              cursor="pointer"
              transition="background 0.2s"
            >
              <Flex align="center" gap={3}>
                <Avatar.Root size="sm" bg={getRoleColor(member.role)}>
                  <Avatar.Fallback name={member.username} />
                </Avatar.Root>
                <Box flex={1}>
                  <Flex align="center" gap={2}>
                    <Text color="white" fontSize="sm" fontWeight="medium">
                      {member.username}
                    </Text>
                    <Badge
                      size="xs"
                      bg={getRoleColor(member.role)}
                      color="white"
                    >
                      {getRoleLabel(member.role)}
                    </Badge>
                  </Flex>

                  {member.character && (
                    <VStack gap={1} align="stretch" mt={1}>
                      <Text color="gray.300" fontSize="xs">
                        角色: {member.character.name} ({member.character.class})
                      </Text>
                      <Flex align="center" gap={2}>
                        <Text color="gray.400" fontSize="xs">
                          HP:
                        </Text>
                        <Text
                          color={getStatusColor(
                            member.character.hp,
                            member.character.maxHp
                          )}
                          fontSize="xs"
                          fontWeight="medium"
                        >
                          {member.character.hp}/{member.character.maxHp}
                        </Text>
                      </Flex>
                      <Text color="gray.400" fontSize="xs">
                        位置: {member.character.location}
                      </Text>
                    </VStack>
                  )}
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  )
}
