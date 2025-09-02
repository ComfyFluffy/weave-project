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
  Select,
  Fieldset,
  Field,
} from '@chakra-ui/react'
import { X } from 'lucide-react'
import { useUpdateWorld, useWorld, useDeleteWorld } from '../hooks/queries'
import { useQueryClient } from '@tanstack/react-query'
import { toaster } from './ui/toaster'
import { ConfirmDialog } from './ConfirmDialog'
import { createListCollection } from '@chakra-ui/react'

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
  const [selectedTag, setSelectedTag] = useState('')
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const queryClient = useQueryClient()
  const updateWorldMutation = useUpdateWorld()
  const deleteWorldMutation = useDeleteWorld()
  const { data: worldData } = useWorld(worldId)

  // 预定义的标签选项
  const tagOptions = [
    { label: '奇幻', value: '奇幻' },
    { label: '科幻', value: '科幻' },
    { label: '现代', value: '现代' },
    { label: '历史', value: '历史' },
    { label: '武侠', value: '武侠' },
    { label: '仙侠', value: '仙侠' },
    { label: '玄幻', value: '玄幻' },
    { label: '都市', value: '都市' },
    { label: '悬疑', value: '悬疑' },
    { label: '恐怖', value: '恐怖' },
    { label: '战争', value: '战争' },
    { label: '冒险', value: '冒险' },
  ]

  const tagCollection = createListCollection({
    items: tagOptions,
  })

  const handleAddTag = () => {
    if (selectedTag && !tags.includes(selectedTag)) {
      if (tags.length < 6) {
        setTags([...tags, selectedTag])
        setSelectedTag('')
      } else {
        // 显示标签数量达到上限的提示
        toaster.create({
          title: '标签数量已达上限',
          description: '每个世界最多可以添加6个标签',
          type: 'warning',
          duration: 3000,
        })
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagSelectChange = (details: { value: string[] }) => {
    if (details.value.length > 0) {
      setSelectedTag(details.value[0])
    } else {
      setSelectedTag('')
    }
  }

  const resetForm = () => {
    if (worldData?.body.world) {
      setName(worldData.body.world.name)
      setDescription(worldData.body.world.description)
      setRules(worldData.body.world.rules)
      setTags(worldData.body.world.tags)
    }
    setSelectedTag('')
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
          toaster.error({
            title: '删除世界失败',
            description: error instanceof Error ? error.message : '未知错误',
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
                    <Fieldset.Root size="sm">
                      <Fieldset.Legend>标签（可选）</Fieldset.Legend>
                      <VStack gap={3} align="stretch">
                        <Field.Root>
                          <Select.Root
                            collection={tagCollection}
                            onValueChange={handleTagSelectChange}
                            value={selectedTag ? [selectedTag] : []}
                            size="sm"
                          >
                            <Select.Label>选择标签</Select.Label>
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="请选择标签" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                              <Select.Content>
                                {tagOptions.map((option) => (
                                  <Select.Item item={option} key={option.value}>
                                    {option.label}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Select.Root>
                        </Field.Root>

                        <Button
                          onClick={handleAddTag}
                          size="sm"
                          variant="outline"
                          disabled={!selectedTag}
                          width="full"
                        >
                          添加标签
                        </Button>

                        {tags.length > 0 && (
                          <Box>
                            <Text fontSize="xs" color="gray.500" mb={1}>
                              已选标签:
                            </Text>
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
                          </Box>
                        )}
                      </VStack>
                    </Fieldset.Root>
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
