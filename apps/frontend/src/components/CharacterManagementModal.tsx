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
import { useWorldCharacters, useCreateCharacter, useDeleteCharacter } from '../hooks/queries'
import { CreateCharacterModal } from './CreateCharacterModal'
import { CharacterDetailModal } from './CharacterDetailModal'
import { ConfirmDialog } from './ConfirmDialog'
import { CharacterCard } from './CharacterCard'
import type { Character } from '@weave/types'

interface CharacterManagementModalProps {
  worldId: string
  myCharacters: Character[]
  isOpen: boolean
  onClose: () => void
  onRemoveFromMyCharacters: (characterId: string) => void
  onSelectCharacter: (character: Character) => void
  onAddToChatCharacters: (character: Character) => void
}

export function CharacterManagementModal({
  worldId,
  myCharacters,
  isOpen,
  onClose,
  onRemoveFromMyCharacters,
  onSelectCharacter,
  onAddToChatCharacters,
}: CharacterManagementModalProps) {
  const { data: worldCharactersData, isLoading, refetch } = useWorldCharacters(worldId)
  const [characters, setCharacters] = useState<Character[]>([])
  const [isCreateCharacterModalOpen, setIsCreateCharacterModalOpen] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [isCharacterDetailModalOpen, setIsCharacterDetailModalOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  
  const { mutate: createCharacter } = useCreateCharacter()
  const { mutate: deleteCharacter } = useDeleteCharacter()

  useEffect(() => {
    if (worldCharactersData?.body.characters) {
      setCharacters(worldCharactersData.body.characters)
    }
  }, [worldCharactersData])

  const handleCreateCharacter = () => {
    // Clear any previous errors
    setError(null)
    // Open create character modal
    setIsCreateCharacterModalOpen(true)
  }

  // Filter characters based on search term
  const filteredMyCharacters = useMemo(() => {
    if (!searchTerm) return myCharacters
    return myCharacters.filter(character => 
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (character.description && character.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [myCharacters, searchTerm])

  const filteredAllCharacters = useMemo(() => {
    if (!searchTerm) return characters
    return characters.filter(character => 
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (character.description && character.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [characters, searchTerm])

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
                      <Search size={16} color="gray.400" style={{ marginRight: '8px' }} />
                      <Input
                        placeholder="搜索角色..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="sm"
                      />
                    </Flex>
                    
                    <Tabs.Root defaultValue="all" onValueChange={(e) => setActiveTab(e.value)}>
                      <Tabs.List mb={4}>
                        <Tabs.Trigger value="my">我的角色</Tabs.Trigger>
                        <Tabs.Trigger value="all">全部角色</Tabs.Trigger>
                      </Tabs.List>
                      
                      <Tabs.Content value="my">
                        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
                          {filteredMyCharacters.map((character) => (
                            <CharacterCard
                              key={character.id}
                              character={character}
                              onShowDetails={() => {
                                setSelectedCharacter(character)
                                setIsCharacterDetailModalOpen(true)
                              }}
                              onDelete={() => {
                                // For "my characters", we just remove from the list
                                onRemoveFromMyCharacters(character.id)
                              }}
                              onAddToChat={() => {
                                onAddToChatCharacters(character)
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
                        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
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
                                onAddToChatCharacters(character)
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
                <Button
                  onClick={onClose}
                  variant="outline"
                  width="full"
                >
                  关闭
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Create Character Modal */}
      <CreateCharacterModal
        worldId={worldId}
        isOpen={isCreateCharacterModalOpen}
        onClose={() => setIsCreateCharacterModalOpen(false)}
        onCreateCharacter={(character) => {
          createCharacter(
            { body: character },
            {
              onSuccess: (data) => {
                // Close the modal
                setIsCreateCharacterModalOpen(false)
                // Clear any previous errors
                setError(null)
                // Refresh the character list
                void refetch()
                
                // If we're on the "my" tab, add the new character to myCharacters list in the parent component
                // but don't automatically add it to the chat characters list
                if (activeTab === 'my' && data.body) {
                  // Add to myCharacters list only
                  onSelectCharacter(data.body)
                }
              },
              onError: (error) => {
                console.error('Failed to create character:', error)
                // Close the modal
                setIsCreateCharacterModalOpen(false)
                // Set error message for display
                if (error instanceof Error) {
                  setError(error.message || '创建角色失败')
                } else {
                  setError('创建角色失败')
                }
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
                  // Refresh the character list
                  void refetch()
                  console.log(`Character ${characterToDelete.name} deleted successfully`)
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
        message={characterToDelete ? `确定要删除角色 "${characterToDelete.name}" 吗？` : ''}
      />
    </>
  )
}