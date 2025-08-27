import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Flex,
  Text,
  Button,
  Grid,
  Portal,
  Dialog,
  Tabs,
  Input,
} from '@chakra-ui/react'
import { Plus, Search } from 'lucide-react'
import {
  useAllCharacters,
  useDeleteCharacter,
  useMyCharacters,
  useUpdateWorldStateCharacters,
  useWorldState,
} from '../hooks/queries'
import { CreateCharacterModal } from './CreateCharacterModal'
import { CharacterDetailModal } from './CharacterDetailModal'
import { ConfirmDialog } from './ConfirmDialog'
import { CharacterCard } from './CharacterCard'
import { toaster } from './ui/toaster'
import { socketService } from '../services/socket'
import { useQueryClient } from '@tanstack/react-query'
import type { Character } from '@weave/types'

interface CharacterManagementModalProps {
  worldStateId: string
  isOpen: boolean
  onClose: () => void
}

export function CharacterManagementModal({
  worldStateId,
  isOpen,
  onClose,
}: CharacterManagementModalProps) {
  const {
    data: allCharactersData,
    isLoading: isLoadingAll,
    refetch: refetchAll,
  } = useAllCharacters()
  const {
    data: myCharactersData,
    isLoading: isLoadingMy,
    refetch: refetchMyCharacters,
  } = useMyCharacters()
  const { data: worldStateData } = useWorldState(worldStateId)

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
  const [activeTab, setActiveTab] = useState<string>('my')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const { mutate: deleteCharacter } = useDeleteCharacter()
  const { mutate: updateWorldStateCharacters } = useUpdateWorldStateCharacters()
  const queryClient = useQueryClient()

  const isLoading = isLoadingAll || isLoadingMy
  const allCharacters = useMemo(
    () => allCharactersData?.body.characters || [],
    [allCharactersData]
  )
  const myCharacters = useMemo(
    () => myCharactersData?.body.characters || [],
    [myCharactersData]
  )

  // Set up socket listeners for real-time character updates
  useEffect(() => {
    if (!isOpen) return

    // Listen for character updates
    const unsubscribeCharacters = socketService.onCharactersUpdated((data) => {
      if (data.worldStateId === worldStateId) {
        // Invalidate queries to trigger a refetch
        // This ensures we have the latest character data from the server
        void queryClient.invalidateQueries({
          queryKey: ['allCharacters'],
        })
        void queryClient.invalidateQueries({
          queryKey: ['myCharacters'],
        })
        void queryClient.invalidateQueries({
          queryKey: ['worldStateCharacters', worldStateId],
        })

        // Invalidate all channel character queries to ensure ChatArea updates
        void queryClient.invalidateQueries({
          queryKey: ['channelCharacters'],
          type: 'active',
        })
      }
    })

    // Clean up listeners on unmount or when modal closes
    return () => {
      unsubscribeCharacters()
    }
  }, [isOpen, worldStateId, queryClient])

  const handleCreateCharacter = () => {
    // Clear any previous errors
    setError(null)
    // Open create character modal
    setIsCreateCharacterModalOpen(true)
  }

  const handleAddCharacterToWorldState = (character: Character) => {
    // We need to get current world state characters first, then add the new one
    // For now, we'll just add the character ID - the backend will handle the logic
    updateWorldStateCharacters(
      {
        params: { worldStateId },
        body: { characterIds: [character.id] }, // Backend should append, not replace
      },
      {
        onSuccess: () => {
          // Refresh the character lists
          void refetchAll()
          void refetchMyCharacters()
          void queryClient.invalidateQueries({
            queryKey: ['channelCharacters'],
            type: 'active',
          })
          // Show success toast
          toaster.success({
            title: '角色已添加',
            description: `"${character.name}" 已成功添加到世界状态`,
            duration: 3000,
          })
        },
        onError: (error) => {
          console.error('Failed to add character to world state:', error)
          setError('添加角色到世界状态失败')
        },
      }
    )
  }

  // Filter characters based on search term
  const filteredMyCharacters = useMemo(() => {
    if (!searchTerm) return myCharacters
    return myCharacters.filter(
      (character) =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (character.description &&
          character.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    )
  }, [myCharacters, searchTerm])

  const filteredAllCharacters = useMemo(() => {
    if (!searchTerm) return allCharacters
    return allCharacters.filter(
      (character) =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (character.description &&
          character.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    )
  }, [allCharacters, searchTerm])

  return (
    <>
      {/* Character Management Modal */}
      <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content width="80vw" maxWidth="1200px" maxHeight="90vh">
              <Dialog.Header>
                <Flex justify="space-between" align="center" width="100%">
                  <Text fontSize="2xl" fontWeight="bold" color="white">
                    角色管理
                  </Text>
                  <Button
                    bgColor="purple.500"
                    color="white"
                    onClick={handleCreateCharacter}
                    colorScheme="blue"
                  >
                    <Plus size={16} />
                    创建新角色
                  </Button>
                </Flex>
              </Dialog.Header>
              <Dialog.Body overflowY="auto">
                {isLoading ? (
                  <Text color="white">加载中...</Text>
                ) : (
                  <>
                    {/* Error Alert */}
                    {error && (
                      <Box
                        bg="red.500"
                        color="white"
                        p={3}
                        borderRadius="md"
                        mb={4}
                      >
                        {error}
                      </Box>
                    )}

                    {/* Search Input */}
                    <Flex mb={4} align="center">
                      <Search
                        size={16}
                        color="gray.400"
                        style={{ marginRight: '8px' }}
                      />
                      <Input
                        placeholder="搜索角色..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="sm"
                      />
                    </Flex>

                    <Tabs.Root
                      defaultValue="my"
                      onValueChange={(e) => setActiveTab(e.value)}
                    >
                      <Tabs.List mb={4}>
                        <Tabs.Trigger value="my">我的角色</Tabs.Trigger>
                        <Tabs.Trigger value="all">全部角色</Tabs.Trigger>
                      </Tabs.List>

                      <Tabs.Content value="my">
                        <Grid
                          templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                          gap={6}
                        >
                          {filteredMyCharacters.map((character) => (
                            <CharacterCard
                              key={character.id}
                              character={character}
                              onShowDetails={() => {
                                setSelectedCharacter(character)
                                setIsCharacterDetailModalOpen(true)
                              }}
                              onDelete={() => {
                                // For "my characters", show confirm dialog for actual deletion
                                setCharacterToDelete(character)
                                setIsConfirmDialogOpen(true)
                              }}
                              onAddToChat={() => {
                                handleAddCharacterToWorldState(character)
                              }}
                              variant="my"
                            />
                          ))}

                          {filteredMyCharacters.length === 0 && (
                            <Box gridColumn="1 / -1" textAlign="center" py={8}>
                              <Text color="gray.500">
                                {searchTerm ? '未找到匹配的角色' : '暂无角色'}
                              </Text>
                            </Box>
                          )}
                        </Grid>
                      </Tabs.Content>

                      <Tabs.Content value="all">
                        <Grid
                          templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                          gap={6}
                        >
                          {filteredAllCharacters.map((character) => (
                            <CharacterCard
                              key={character.id}
                              character={character}
                              onShowDetails={() => {
                                setSelectedCharacter(character)
                                setIsCharacterDetailModalOpen(true)
                              }}
                              onDelete={() => {
                                // For "all characters", we show a confirm dialog
                                setCharacterToDelete(character)
                                setIsConfirmDialogOpen(true)
                              }}
                              onAddToChat={() => {
                                handleAddCharacterToWorldState(character)
                              }}
                              variant="all"
                            />
                          ))}

                          {filteredAllCharacters.length === 0 && (
                            <Box gridColumn="1 / -1" textAlign="center" py={8}>
                              <Text color="gray.500">
                                {searchTerm ? '未找到匹配的角色' : '暂无角色'}
                              </Text>
                            </Box>
                          )}
                        </Grid>
                      </Tabs.Content>
                    </Tabs.Root>
                  </>
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Button onClick={onClose} variant="outline" width="full">
                  关闭
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Create Character Modal */}
      <Dialog.Root
        open={isCreateCharacterModalOpen}
        onOpenChange={(e) => !e.open && setIsCreateCharacterModalOpen(false)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <CreateCharacterModal
              open={isCreateCharacterModalOpen}
              onClose={() => setIsCreateCharacterModalOpen(false)}
              onCharacterCreated={(character) => {
                // Clear any previous errors
                setError(null)
                // Refresh the character lists
                void refetchAll()
                void refetchMyCharacters()

                // Show success message
                toaster.success({
                  title: '角色创建成功',
                  description: `角色 "${character.name}" 已创建`,
                  duration: 3000,
                })
              }}
            />
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Character Detail Modal */}
      <CharacterDetailModal
        character={selectedCharacter}
        isOpen={isCharacterDetailModalOpen}
        onClose={() => setIsCharacterDetailModalOpen(false)}
        characterState={
          selectedCharacter
            ? worldStateData?.body.worldState.state.characterStates?.[
                selectedCharacter.id
              ]
            : undefined
        }
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
                  // Refresh the character lists
                  void refetchAll()
                  void refetchMyCharacters()
                  toaster.success({
                    title: '角色删除成功',
                    description: `角色 "${characterToDelete.name}" 已删除`,
                    duration: 3000,
                  })
                  // Close the dialog
                  setIsConfirmDialogOpen(false)
                  setCharacterToDelete(null)
                },
                onError: (error) => {
                  console.error('Failed to delete character:', error)
                  if (error instanceof Error) {
                    setError(error.message || '删除角色失败')
                  } else {
                    setError('删除角色失败')
                  }
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
    </>
  )
}
