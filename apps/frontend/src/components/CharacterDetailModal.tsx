import {
  Button,
  VStack,
  Portal,
  Dialog,
  Image,
  Text,
  Box,
  Stack,
} from '@chakra-ui/react'
import type { Character } from '@weave/types'

interface CharacterDetailModalProps {
  character: Character | null
  isOpen: boolean
  onClose: () => void
}

export const CharacterDetailModal = ({
  character,
  isOpen,
  onClose,
}: CharacterDetailModalProps) => {
  // Placeholder image URL - in a real app, this would come from the character data
  const getCharacterImage = (character: Character) => {
    // Return a placeholder image for now
    // In the future, this would return character.avatar if available
    return (
      'https://placehold.co/400x400/4A5568/FFFFFF?text=' +
      encodeURIComponent(character.name.charAt(0))
    )
  }

  if (!character) return null

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content width="500px">
            <Dialog.Header>{character.name}</Dialog.Header>
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                {/* Character Image */}
                <Box display="flex" justifyContent="center">
                  <Image
                    src={getCharacterImage(character)}
                    alt={character.name}
                    borderRadius="full"
                    boxSize="200px"
                    objectFit="cover"
                  />
                </Box>

                {/* Character Description */}
                <Stack>
                  <Text fontSize="sm" fontWeight="bold" color="gray.400">
                    描述
                  </Text>
                  <Text color="white" whiteSpace="pre-wrap">
                    {character.description || '暂无描述'}
                  </Text>
                </Stack>

                {/* Additional Character Details */}
                <Stack>
                  <Text fontSize="sm" fontWeight="bold" color="gray.400">
                    详细信息
                  </Text>
                  <Text color="white">ID: {character.id}</Text>
                </Stack>

                <VStack gap={2} mt={2}>
                  <Button
                    onClick={onClose}
                    size="sm"
                    width="full"
                    colorPalette="blue"
                  >
                    关闭
                  </Button>
                </VStack>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
