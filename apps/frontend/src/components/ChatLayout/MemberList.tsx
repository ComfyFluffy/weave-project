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
import { getRoleColor, getRoleLabel } from '../../utils/ui'
import type { User } from '@weave/types'

interface MemberListProps {
  members?: User[]
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
                <Avatar.Root size="sm" bg="blue.500">
                  <Avatar.Fallback name={member.displayName} />
                </Avatar.Root>
                <Box flex={1}>
                  <Text color="white" fontSize="sm" fontWeight="medium">
                    {member.displayName}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  )
}
