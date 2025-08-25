/**
 * @deprecated This page is not currently used in the routing.
 * Character management is now handled via the CharacterManagementModal.
 * Consider removing this file or updating it to work with the new WorldState-based approach.
 */

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Box, Flex, Text, Button, Grid, Image, Stack } from '@chakra-ui/react'
import { ArrowLeft, Plus } from 'lucide-react'
import {
  useChannelCharacters,
  useCreateCharacter,
  useDeleteCharacter,
} from '../hooks/queries'
import { CreateCharacterModal } from '../components/CreateCharacterModal'
import { CharacterDetailModal } from '../components/CharacterDetailModal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import type { Character } from '@weave/types'

export function CharactersPage() {
  const navigate = useNavigate()
  const { worldId } = useParams<{ worldId: string }>()
  // const { data: worldCharactersData, isLoading } = useChannelCharacters(channelId) // TODO: Need channelId
  const isLoading = false
  const [characters, setCharacters] = useState<Character[]>([])
  const [isCreateCharacterModalOpen, setIsCreateCharacterModalOpen] =
    useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )
  const [isCharacterDetailModalOpen, setIsCharacterDetailModalOpen] =
    useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(
    null
  )

  const { mutate: createCharacter } = useCreateCharacter()
  const { mutate: deleteCharacter } = useDeleteCharacter()

  useEffect(() => {
    // TODO: Update when we have proper world characters endpoint
    // if (worldCharactersData?.body.characters) {
    //   setCharacters(worldCharactersData.body.characters)
    // }
  }, []) // [worldCharactersData]

  const handleCreateCharacter = () => {
    // Open create character modal
    setIsCreateCharacterModalOpen(true)
  }

  const handleBack = () => {
    void navigate('/app')
  }

  // Placeholder image URL - in a real app, this would come from the character data
  const getCharacterImage = (character: Character) => {
    // Return a placeholder image for now
    // In the future, this would return character.avatar if available
    return (
      'https://placehold.co/200x200/4A5568/FFFFFF?text=' +
      encodeURIComponent(character.name.charAt(0))
    )
  }

  return (
    <Box minHeight="100vh" bg="gray.900" p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Button onClick={handleBack} variant="ghost" color="white">
          <ArrowLeft size={16} />
          返回
        </Button>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          角色管理
        </Text>
        <Button onClick={handleCreateCharacter} colorScheme="blue">
          <Plus size={16} />
          创建新角色
        </Button>
      </Flex>

      {isLoading ? (
        <Text color="white">加载中...</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {characters.map((character) => (
            <Box
              key={character.id}
              bg="gray.800"
              p={4}
              borderRadius="lg"
              boxShadow="md"
              onClick={() => {
                setSelectedCharacter(character)
                setIsCharacterDetailModalOpen(true)
              }}
              cursor="pointer"
              _hover={{ bg: 'gray.750' }}
            >
              <Box position="relative">
                <Button
                  position="absolute"
                  top="2"
                  right="2"
                  size="sm"
                  colorScheme="red"
                  zIndex="1"
                  onClick={(e) => {
                    // Prevent the click event from bubbling up to the parent Box
                    e.stopPropagation()
                    // Set the character to delete and open the confirm dialog
                    setCharacterToDelete(character)
                    setIsConfirmDialogOpen(true)
                  }}
                >
                  删除
                </Button>
                <Stack gap={4}>
                  <Box position="relative">
                    <Image
                      src={getCharacterImage(character)}
                      alt={character.name}
                      borderRadius="full"
                      boxSize="150px"
                      objectFit="cover"
                    />
                  </Box>
                  <Stack gap={1} alignItems="center">
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      {character.name}
                    </Text>
                    <Text fontSize="sm" color="gray.400" textAlign="center">
                      {character.description || '暂无描述'}
                    </Text>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          ))}
        </Grid>
      )}

      {/* Create Character Modal */}
      <CreateCharacterModal
        isOpen={isCreateCharacterModalOpen}
        onClose={() => setIsCreateCharacterModalOpen(false)}
        onCreateCharacter={(character) => {
          createCharacter(
            { body: character },
            {
              onSuccess: () => {
                // Close the modal
                setIsCreateCharacterModalOpen(false)
                // Refresh the character list
                // Since we're using react-query, we can simply refetch the data
                // The useEffect will automatically update the characters state
              },
              onError: (error) => {
                console.error('Failed to create character:', error)
                // Close the modal even if there's an error
                setIsCreateCharacterModalOpen(false)
              },
            }
          )
        }}
      />

      {/* Character Detail Modal */}
      <CharacterDetailModal
        character={selectedCharacter}
        isOpen={isCharacterDetailModalOpen}
        onClose={() => setIsCharacterDetailModalOpen(false)}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false)
          setCharacterToDelete(null)
        }}
        onConfirm={() => {
          if (characterToDelete) {
            deleteCharacter(
              { params: { id: characterToDelete.id } },
              {
                onSuccess: () => {
                  // The character list will automatically update due to react-query
                  console.log(
                    `Character ${characterToDelete.name} deleted successfully`
                  )
                },
                onError: (error: any) => {
                  console.error('Failed to delete character:', error)
                },
              }
            )
          }
        }}
        title="确认删除"
        message={
          characterToDelete
            ? `确定要删除角色 "${characterToDelete.name}" 吗？`
            : ''
        }
      />
    </Box>
  )
}
