import { useState, useEffect } from 'react'
import {
  Button,
  Input,
  Textarea,
  VStack,
  Portal,
  Dialog,
  IconButton,
  HStack,
  Box,
  Text,
  Separator,
} from '@chakra-ui/react'
import { X } from 'lucide-react'
import { useUpdateWorld, useWorld, useDeleteWorld } from '../hooks/queries'
import { useQueryClient } from '@tanstack/react-query'
import { toaster } from './ui/toaster'
import { ConfirmDialog } from './ConfirmDialog'

interface EditWorldModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  worldId: string
  onWorldUpdated?: () => void
}

export const EditWorldModal = ({
  open: isModalOpen,
  onOpenChange,
  worldId,
  onWorldUpdated,
}: EditWorldModalProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const queryClient = useQueryClient()
  const updateWorldMutation = useUpdateWorld()
  const deleteWorldMutation = useDeleteWorld()
  const { data: worldData } = useWorld(worldId)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const resetForm = () => {
    if (worldData?.body.world) {
      setName(worldData.body.world.name)
      setDescription(worldData.body.world.description)
      setRules(worldData.body.world.rules)
      setTags(worldData.body.world.tags)
    }
    setNewTag('')
  }

  const handleClose = () => {
    onOpenChange(false)
    resetForm()
  }

  // Handle dialog open change events
  const handleDialogOpenChange = (details: { open: boolean }) => {
    onOpenChange(details.open)
    if (!details.open) {
      resetForm()
    }
  }

  const handleUpdateWorld = async () => {
    if (!name.trim()) return

    try {
      await updateWorldMutation.mutateAsync({
        params: { worldId },
        body: {
          name: name.trim(),
          description: description.trim(),
          tags,
          rules: rules.trim(),
        },
      })

      // Invalidate and refetch worlds
      await queryClient.invalidateQueries({
        queryKey: ['worlds'],
      })

      // Invalidate and refetch current world
      await queryClient.invalidateQueries({
        queryKey: ['world', worldId],
      })

      onWorldUpdated?.()
      handleClose()
      toaster.success({
        title: '世界更新成功',
        description: '世界信息已成功更新',
        duration: 3000,
      })
    } catch (error) {
      console.error('Failed to update world:', error)
      toaster.error({
        title: '更新世界失败',
        description: error instanceof Error ? error.message : '未知错误',
        duration: 3000,
      })
    }
  }

  const handleDeleteWorld = () => {
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteWorldMutation.mutate(
      { params: { worldId } },
      {
        onSuccess: () => {
          // Refresh the worlds list
          void queryClient.invalidateQueries({ queryKey: ['worlds'] })
          toaster.success({
            title: '世界删除成功',
            description: '世界已被成功删除',
            duration: 3000,
          })
          handleClose()
        },
        onError: (error) => {
          console.error('Failed to delete world:', error)
          // 直接显示后端返回的错误信息
          toaster.error({
            title: '删除世界失败',
            description: (error as any)?.body?.message,
            duration: 3000,
          })
          setIsConfirmDialogOpen(false)
        },
      }
    )
  }

  // Update form when world data changes
  useEffect(() => {
    if (worldData?.body.world) {
      setName(worldData.body.world.name)
      setDescription(worldData.body.world.description)
      setRules(worldData.body.world.rules)
      setTags(worldData.body.world.tags)
    }
  }, [worldData])

  return (
    <>
      <Dialog.Root open={isModalOpen} onOpenChange={handleDialogOpenChange}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content width="400px">
              <Dialog.Header>编辑世界</Dialog.Header>
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <div>
                    <label
                      style={{
                        fontSize: '14px',
                        marginBottom: '4px',
                        display: 'block',
                      }}
                    >
                      世界名称
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="输入世界名称"
                      size="sm"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: '14px',
                        marginBottom: '4px',
                        display: 'block',
                      }}
                    >
                      世界描述
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="描述这个世界的背景和设定"
                      resize="none"
                      rows={3}
                      size="sm"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: '14px',
                        marginBottom: '4px',
                        display: 'block',
                      }}
                    >
                      标签
                    </label>
                    <VStack gap={2} align="stretch">
                      <HStack>
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="添加标签 (如: 奇幻, 科幻, 现代)"
                          size="sm"
                          flex={1}
                        />
                        <Button
                          onClick={handleAddTag}
                          size="sm"
                          variant="outline"
                          disabled={!newTag.trim()}
                        >
                          添加
                        </Button>
                      </HStack>
                      {tags.length > 0 && (
                        <HStack wrap="wrap">
                          {tags.map((tag) => (
                            <Box
                              key={tag}
                              display="flex"
                              alignItems="center"
                              bg="blue.500"
                              color="white"
                              px={2}
                              py={1}
                              borderRadius="md"
                              fontSize="sm"
                            >
                              <Text>{tag}</Text>
                              <IconButton
                                size="xs"
                                variant="ghost"
                                ml={1}
                                color="white"
                                _hover={{ bg: 'blue.600' }}
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X size={12} />
                              </IconButton>
                            </Box>
                          ))}
                        </HStack>
                      )}
                    </VStack>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: '14px',
                        marginBottom: '4px',
                        display: 'block',
                      }}
                    >
                      规则 (可选)
                    </label>
                    <Textarea
                      value={rules}
                      onChange={(e) => setRules(e.target.value)}
                      placeholder="世界的规则和约定"
                      resize="none"
                      rows={3}
                      size="sm"
                    />
                  </div>

                  <VStack gap={2} mt={2}>
                    <Button
                      onClick={() => void handleUpdateWorld()}
                      loading={updateWorldMutation.isPending}
                      disabled={!name.trim()}
                      size="sm"
                      width="full"
                      colorPalette="blue"
                    >
                      更新世界
                    </Button>
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      size="sm"
                      width="full"
                    >
                      取消
                    </Button>
                  </VStack>

                  <Separator />

                  <VStack gap={2} mt={2}>
                    <Button
                      onClick={handleDeleteWorld}
                      loading={deleteWorldMutation.isPending}
                      size="sm"
                      width="full"
                      colorPalette="red"
                    >
                      删除世界
                    </Button>
                    <Text fontSize="xs" color="gray.400" textAlign="center">
                      删除世界将永久移除所有相关数据，包括频道、角色和世界状态等
                    </Text>
                  </VStack>
                </VStack>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Confirm Dialog for World Deletion */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="删除世界"
        message="确定要删除这个世界吗？此操作不可撤销，所有相关数据（包括频道、角色、世界状态等）都将被永久删除。"
        confirmText="删除"
        cancelText="取消"
      />
    </>
  )
}
