import {
  Button,
  Dialog,
  CloseButton,
  Portal,
  VStack,
  HStack,
  Text,
  Box,
  Badge,
} from '@chakra-ui/react'
import { useState } from 'react'
import type { PlayerCharacter } from '@weave/types'

interface CharacterSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  characters: PlayerCharacter[]
  selectedCharacterId?: string
  onSelectCharacter: (character: PlayerCharacter) => void
  onCreateNew: () => void
}

export function CharacterSelectionModal({
  isOpen,
  onClose,
  characters,
  selectedCharacterId,
  onSelectCharacter,
  onCreateNew,
}: CharacterSelectionModalProps) {
  const [tempSelectedId, setTempSelectedId] = useState<string | undefined>(
    selectedCharacterId
  )

  const handleConfirm = () => {
    const selectedCharacter = characters.find((c) => c.id === tempSelectedId)
    if (selectedCharacter) {
      onSelectCharacter(selectedCharacter)
    }
    onClose()
  }

  const handleCreateNew = () => {
    onClose()
    onCreateNew()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxWidth="lg">
            <Dialog.Header>
              <Dialog.Title>选择角色</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={4} align="stretch">
                {characters.length === 0 ? (
                  <Box
                    p={8}
                    textAlign="center"
                    borderWidth={2}
                    borderStyle="dashed"
                    borderColor="gray.600"
                    borderRadius="md"
                  >
                    <Text color="gray.400" mb={4}>
                      你还没有角色
                    </Text>
                    <Button onClick={handleCreateNew}>创建第一个角色</Button>
                  </Box>
                ) : (
                  <>
                    <Text color="gray.300" mb={2}>
                      选择一个角色加入这个世界：
                    </Text>
                    <VStack gap={2} align="stretch">
                      {characters.map((character) => (
                        <Box
                          key={character.id}
                          p={4}
                          borderWidth={2}
                          borderColor={
                            tempSelectedId === character.id
                              ? 'blue.500'
                              : 'gray.600'
                          }
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => setTempSelectedId(character.id)}
                          bg={
                            tempSelectedId === character.id
                              ? 'blue.900'
                              : 'gray.800'
                          }
                          _hover={{ borderColor: 'blue.400' }}
                        >
                          <HStack justify="space-between" align="start">
                            <VStack align="start" gap={1}>
                              <Text fontWeight="bold" fontSize="lg">
                                {character.name}
                              </Text>
                              <HStack>
                                <Badge colorScheme="purple">
                                  {character.class}
                                </Badge>
                                <Badge colorScheme="green">
                                  {character.location}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.400">
                                生命值: {character.hp}/{character.maxHp}
                              </Text>
                              {character.inventory.length > 0 && (
                                <Text fontSize="sm" color="gray.400">
                                  物品: {character.inventory.join(', ')}
                                </Text>
                              )}
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                    <Button variant="outline" onClick={handleCreateNew} mt={4}>
                      创建新角色
                    </Button>
                  </>
                )}
              </VStack>
            </Dialog.Body>

            {characters.length > 0 && (
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onClose}>
                    取消
                  </Button>
                </Dialog.ActionTrigger>
                <Button onClick={handleConfirm} disabled={!tempSelectedId}>
                  确认选择
                </Button>
              </Dialog.Footer>
            )}

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
