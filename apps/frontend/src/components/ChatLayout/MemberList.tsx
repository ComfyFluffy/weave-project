import { Box, VStack, Text, Avatar, Flex, Badge } from '@chakra-ui/react'
import type { WorldMember } from '@weave/types'

interface MemberListProps {
  members?: WorldMember[]
}

export function MemberList({ members = [] }: MemberListProps) {
  // Mock data
  const mockMembers: WorldMember[] =
    members.length > 0
      ? members
      : [
          {
            id: '1',
            username: '游戏主持人',
            role: 'gm',
            character: {
              id: 'gm1',
              name: '智慧老人',
              class: '游戏主持人',
              hp: 100,
              maxHp: 100,
              location: '神域',
              inventory: [],
            },
          },
          {
            id: '2',
            username: '龙骑士玩家',
            role: 'player',
            character: {
              id: 'p1',
              name: '阿尔萨斯',
              class: '圣骑士',
              hp: 85,
              maxHp: 100,
              location: '酒馆',
              inventory: ['神圣剑', '治疗药水'],
            },
          },
          {
            id: '3',
            username: '法师玩家',
            role: 'player',
            character: {
              id: 'p2',
              name: '梅林',
              class: '法师',
              hp: 60,
              maxHp: 80,
              location: '酒馆',
              inventory: ['法杖', '魔法书'],
            },
          },
          {
            id: '4',
            username: '观察者',
            role: 'spectator',
          },
        ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'gm':
        return 'purple.400'
      case 'player':
        return 'green.400'
      case 'spectator':
        return 'gray.400'
      default:
        return 'gray.400'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'gm':
        return '主持人'
      case 'player':
        return '玩家'
      case 'spectator':
        return '观察者'
      default:
        return ''
    }
  }

  const getStatusColor = (hp: number, maxHp: number) => {
    const ratio = hp / maxHp
    if (ratio > 0.7) return 'green.400'
    if (ratio > 0.3) return 'yellow.400'
    return 'red.400'
  }

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
        <Text fontWeight="bold" color="white" fontSize="md">
          成员 — {mockMembers.length}
        </Text>
      </Box>

      {/* Members List */}
      <Box height="calc(100vh - 81px)" overflowY="auto">
        <VStack gap={0} align="stretch" p={2}>
          {mockMembers.map((member) => (
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
