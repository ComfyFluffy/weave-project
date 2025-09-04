import { Box, Text, VStack, HStack } from '@chakra-ui/react'
import type { Character, CharacterState } from '@weave/types'

interface CharacterListPanelProps {
  characters: Character[]
  characterStates: Record<string, CharacterState>
  onSelectCharacter: (characterId: string) => void
}

export function CharacterListPanel({
  characters,
  characterStates,
  onSelectCharacter,
}: CharacterListPanelProps) {
  return (
    <VStack align="stretch" gap={3}>
      <Text fontSize="lg" fontWeight="bold" color="white">
        角色列表
      </Text>
      {characters.length > 0 ? (
        characters.map((character) => {
          const characterState = characterStates[character.id] || {
            currentLocationName: '',
            inventory: [],
            stats: {},
            attributes: {},
            properties: {},
            knowledge: {},
            goals: {},
            secrets: {},
            discoveredLores: [],
          }
          const isNPC = character.id.startsWith('npc-')

          return (
            <Box
              key={character.id}
              bg="gray.700"
              p={3}
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: 'gray.600' }}
              onClick={() => onSelectCharacter(character.id)}
            >
              <HStack justify="space-between">
                <HStack gap={2}>
                  <Text color="white" fontWeight="medium">
                    {character.name}
                  </Text>
                  <Box
                    bg={isNPC ? 'purple.500' : 'blue.500'}
                    color="white"
                    px={1}
                    py={0.5}
                    borderRadius="sm"
                    fontSize="xs"
                  >
                    {isNPC ? 'NPC' : '玩家角色'}
                  </Box>
                </HStack>
                <HStack gap={2}>
                  {characterState.currentLocationName && (
                    <Text color="gray.400" fontSize="sm">
                      位于: {characterState.currentLocationName}
                    </Text>
                  )}
                  <Text color="gray.400" fontSize="sm">
                    物品: {characterState.inventory?.length || 0} 件
                  </Text>
                </HStack>
              </HStack>
              {character.description && (
                <Text
                  color="gray.400"
                  fontSize="sm"
                  mt={1}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {character.description}
                </Text>
              )}
            </Box>
          )
        })
      ) : (
        <Text color="gray.500" textAlign="center" py={4}>
          暂无角色数据
        </Text>
      )}
    </VStack>
  )
}
