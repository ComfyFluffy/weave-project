import { Box, Image, Stack, Text, Button, Avatar } from '@chakra-ui/react'
import type { Character } from '@weave/types'
import { isEmoji } from '../utils/image'

interface CharacterCardProps {
  character: Character
  showActions?: boolean
  onShowDetails?: () => void
  onDelete?: () => void
  onAddToChat?: () => void
  variant?: 'my' | 'all'
}

export const CharacterCard = ({
  character,
  showActions = true,
  onShowDetails,
  onDelete,
  onAddToChat,
}: CharacterCardProps) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.()
  }

  const handleAddToChatClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToChat?.()
  }

  return (
    <Box
      bg="gray.800"
      p={4}
      borderRadius="lg"
      boxShadow="md"
      onClick={onShowDetails}
      cursor={onShowDetails ? 'pointer' : 'default'}
      _hover={onShowDetails ? { bg: 'gray.750' } : {}}
      height="100%"
    >
      <Stack gap={4} height="100%">
        <Box position="relative" display="flex" justifyContent="center">
          <Avatar.Root size="2xl">
            {character.avatar ? (
              isEmoji(character.avatar) ? (
                <Avatar.Fallback
                  name={character.name}
                  fontSize="4xl"
                  bg="gray.600"
                >
                  {character.avatar}
                </Avatar.Fallback>
              ) : (
                <Image
                  src={character.avatar}
                  alt={character.name}
                  borderRadius="full"
                  objectFit="cover"
                  width="full"
                  height="full"
                />
              )
            ) : (
              <Avatar.Fallback name={character.name} bg="gray.600">
                {character.name[0]}
              </Avatar.Fallback>
            )}
          </Avatar.Root>
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
                onClick={handleDeleteClick}
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
                onClick={handleAddToChatClick}
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
