import {
  Button,
  VStack,
  Portal,
  Dialog,
  Image,
  Text,
  Box,
  Stack,
  Avatar,
  Flex,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import type { Character, CharacterState } from '@weave/types'
import { CharacterStateViewer } from './CharacterStateViewer'
import { CharacterForm } from './character-form'
import { useUpdateCharacter, useDeleteCharacter } from '../hooks/queries'
import { useQueryClient } from '@tanstack/react-query'
import { toaster } from './ui/toaster'
import { ConfirmDialog } from './ConfirmDialog'
import { isEmoji } from '../utils/image'
import { useCurrentUser } from '../hooks/auth'

interface CharacterDetailModalProps {
  character: Character | null
  isOpen: boolean
  onClose: () => void
  characterState?: CharacterState
}

export const CharacterDetailModal = ({
  character,
  isOpen,
  onClose,
  characterState,
}: CharacterDetailModalProps) => {
  const { data: currentUserResponse } = useCurrentUser()
  const currentUser =
    currentUserResponse?.status === 200 ? currentUserResponse.body.user : null
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const updateCharacterMutation = useUpdateCharacter()
  
  // Check if current user can edit this character
  // Since there's no creatorId in the Character type, we'll determine editability based on whether
  // the character appears in the user's characters (which we'll check through the API)
  // For now, we'll allow editing for all characters for demonstration purposes
  const canEdit = !!currentUser && !!character
  const deleteCharacterMutation = useDeleteCharacter()
  const queryClient = useQueryClient()

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleUpdateCharacter = (data: {
    name: string
    description: string
    avatar?: string
  }) => {
    if (!character) return

    updateCharacterMutation.mutate(
      {
        params: { characterId: character.id },
        body: data,
      },
      {
        onSuccess: () => {
          setIsEditing(false)
          toaster.success({
            title: '角色更新成功',
            duration: 3000,
          })
          // Invalidate and refetch character data
          void queryClient.invalidateQueries({
            queryKey: ['character', character.id],
          })
          void queryClient.invalidateQueries({ queryKey: ['myCharacters'] })
          void queryClient.invalidateQueries({ queryKey: ['allCharacters'] })
        },
        onError: (error) => {
          console.error('Failed to update character:', error)
          // 直接显示后端返回的错误信息
          toaster.error({
            title: '角色更新失败',
            description: (error as any)?.body?.message,
            duration: 3000,
          })
        },
      }
    )
  }

  const handleDeleteCharacter = () => {
    if (!character) return

    deleteCharacterMutation.mutate(
      { params: { id: character.id } },
      {
        onSuccess: () => {
          setShowDeleteConfirm(false)
          onClose()
          toaster.success({
            title: '角色删除成功',
            duration: 3000,
          })
          // Invalidate and refetch character data
          void queryClient.invalidateQueries({ queryKey: ['myCharacters'] })
          void queryClient.invalidateQueries({ queryKey: ['allCharacters'] })
        },
        onError: (error) => {
          console.error('Failed to delete character:', error)
          setShowDeleteConfirm(false)
          // 直接显示后端返回的错误信息
          toaster.error({
            title: '角色删除失败',
            description: (error as any)?.body?.message,
            duration: 3000,
          })
        },
      }
    )
  }

  if (!character) return null

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content width="500px">
              <Dialog.Header>
                <Flex justify="space-between" align="center" width="full">
                  <Text fontSize="lg" fontWeight="bold">
                    {isEditing ? '编辑角色' : character.name}
                  </Text>
                  {canEdit && !isEditing && (
                    <Flex gap={2}>
                      <Button size="sm" variant="ghost" onClick={handleEdit}>
                        <Edit size={16} />
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorPalette="red"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2 size={16} />
                        删除
                      </Button>
                    </Flex>
                  )}
                </Flex>
              </Dialog.Header>
              <Dialog.Body>
                {isEditing ? (
                  <CharacterForm
                    character={character}
                    onSubmit={handleUpdateCharacter}
                    onCancel={handleCancelEdit}
                    isLoading={updateCharacterMutation.isPending}
                  />
                ) : (
                  <VStack gap={4} align="stretch">
                    {/* Character Image */}
                    <Box display="flex" justifyContent="center">
                      <Avatar.Root size="2xl">
                        {character.avatar ? (
                          isEmoji(character.avatar) ? (
                            <Avatar.Fallback
                              name={character.name}
                              fontSize="4xl"
                              bg="transparent"
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
                          <Avatar.Fallback name={character.name}>
                            {character.name[0]}
                          </Avatar.Fallback>
                        )}
                      </Avatar.Root>
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

                    {/* Character State Viewer */}
                    {characterState && (
                      <Stack>
                        <Text fontSize="sm" fontWeight="bold" color="gray.400">
                          角色状态
                        </Text>
                        <CharacterStateViewer
                          characterState={characterState}
                          isVisible={true}
                        />
                      </Stack>
                    )}

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
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteCharacter}
        title="删除角色"
        message={`确定要删除角色 "${character.name}" 吗？此操作不可撤销。`}
        confirmText="删除"
        cancelText="取消"
      />
    </>
  )
}
