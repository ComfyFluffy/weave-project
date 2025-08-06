import { Box, Text, VStack, HStack } from '@chakra-ui/react'
import type { Character, CharacterState } from '@weave/types'

interface CharacterStatusPanelProps {
  character: Character
  state: CharacterState
}

export function CharacterStatusPanel({
  character,
  state,
}: CharacterStatusPanelProps) {
  // Get the most important stats to display
  const healthStat = state.stats?.health
  const manaStat = state.stats?.mana
  const staminaStat = state.stats?.stamina

  return (
    <Box
      bg="gray.800"
      p={4}
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.600"
    >
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between">
          <HStack gap={2}>
            <Text fontSize="md" fontWeight="bold" color="white">
              {character.name}
            </Text>
            {character.isNpc && (
              <Box
                bg="orange.500"
                color="white"
                px={1}
                py={0.5}
                borderRadius="sm"
                fontSize="xs"
              >
                NPC
              </Box>
            )}
          </HStack>
          <Box
            bg={character.isNpc ? 'orange.500' : 'blue.500'}
            color="white"
            px={1}
            py={0.5}
            borderRadius="sm"
            fontSize="xs"
          >
            {character.isNpc ? 'NPC' : '玩家角色'}
          </Box>
        </HStack>

        <Text fontSize="sm" color="gray.400">
          {character.description}
        </Text>

        <Box height="1px" bg="gray.600" />

        <VStack align="stretch" gap={2}>
          <Text fontSize="sm" fontWeight="bold" color="white">
            当前状态
          </Text>

          {healthStat && (
            <VStack align="stretch" gap={1}>
              <HStack justify="space-between">
                <Text fontSize="xs" color="gray.400">
                  生命值
                </Text>
                <Text fontSize="xs" color="white">
                  {healthStat.current}/{healthStat.max}
                </Text>
              </HStack>
              <Box
                height="4px"
                bg="gray.700"
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  height="100%"
                  bg="red.500"
                  width={`${healthStat.max ? (healthStat.current / healthStat.max) * 100 : 0}%`}
                />
              </Box>
            </VStack>
          )}

          {manaStat && (
            <VStack align="stretch" gap={1}>
              <HStack justify="space-between">
                <Text fontSize="xs" color="gray.400">
                  法力值
                </Text>
                <Text fontSize="xs" color="white">
                  {manaStat.current}/{manaStat.max}
                </Text>
              </HStack>
              <Box
                height="4px"
                bg="gray.700"
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  height="100%"
                  bg="blue.500"
                  width={`${manaStat.max ? (manaStat.current / manaStat.max) * 100 : 0}%`}
                />
              </Box>
            </VStack>
          )}

          {staminaStat && (
            <VStack align="stretch" gap={1}>
              <HStack justify="space-between">
                <Text fontSize="xs" color="gray.400">
                  体力
                </Text>
                <Text fontSize="xs" color="white">
                  {staminaStat.current}/{staminaStat.max}
                </Text>
              </HStack>
              <Box
                height="4px"
                bg="gray.700"
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  height="100%"
                  bg="green.500"
                  width={`${staminaStat.max ? (staminaStat.current / staminaStat.max) * 100 : 0}%`}
                />
              </Box>
            </VStack>
          )}
        </VStack>

        <Box height="1px" bg="gray.600" />

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.400">
            当前位置:
          </Text>
          <Text fontSize="sm" color="white">
            {state.currentLocationName}
          </Text>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.400">
            拥有物品:
          </Text>
          <Text fontSize="sm" color="white">
            {state.inventory?.length || 0} 件
          </Text>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.400">
            已知传说:
          </Text>
          <Text fontSize="sm" color="white">
            {state.discoveredLores?.length || 0} 项
          </Text>
        </HStack>
      </VStack>
    </Box>
  )
}
