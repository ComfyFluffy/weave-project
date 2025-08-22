import { Box, Image, Stack, Text, Button } from '@chakra-ui/react'
import type { Character } from '@weave/types'

interface CharacterCardProps {
  character: Character
  showActions?: boolean
  onShowDetails?: () => void
  onDelete?: () => void
  onAddToChat?: () => void
  variant?: 'my' | 'all'
}

// Placeholder image URL - in a real app, this would come from the character data
const getCharacterImage = (character: Character) => {
  // Return a placeholder image for now
  // In the future, this would return character.avatar if available
  return 'https://placehold.co/200x200/4A5568/FFFFFF?text=' + encodeURIComponent(character.name.charAt(0))
}

export const CharacterCard = ({
  character,
  showActions = true,
  onShowDetails,
  onDelete,
  onAddToChat,
  variant = 'all'
}: CharacterCardProps) => {
  return (
    <Box
      bg="gray.800"
      p={4}
      borderRadius="lg"
      boxShadow="md"
      onClick={onShowDetails}
      cursor={onShowDetails ? "pointer" : "default"}
      _hover={onShowDetails ? { bg: 'gray.750' } : {}}
      height="100%"
    >
      <Stack gap={4} height="100%">
        <Box position="relative" display="flex" justifyContent="center">
          <Image
            src={getCharacterImage(character)}
            alt={character.name}
            borderRadius="full"
            boxSize="150px"
            objectFit="cover"
          />
        </Box>
        <Stack gap={1} alignItems="center" flexGrow={1}>
          <Text fontSize="lg" fontWeight="bold" color="white">
            {character.name}
          </Text>
          <Text fontSize="sm" color="gray.400" textAlign="center">
            {character.description || '暂无描述'}
          </Text>
        </Stack>
        
        {showActions && (
          <Stack direction="row" gap={2} justify="center">
            {onDelete && (
              <Button
                size="sm"
                bgColor="red.500"
                color="white"
                _hover={{ bgColor: 'red.600' }}
                onClick={(e) => {
                  // Prevent the click event from bubbling up to the parent Box
                  e.stopPropagation()
                  onDelete()
                }}
              >
                删除
              </Button>
            )}
            
            {onAddToChat && (
              <Button
                size="sm"
                bgColor="purple.500"
                color="white"
                _hover={{ bgColor: 'purple.600' }}
                onClick={(e) => {
                  // Prevent the click event from bubbling up to the parent Box
                  e.stopPropagation()
                  onAddToChat()
                }}
              >
                添加
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}