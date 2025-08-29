import { useState } from 'react'
import {
  Button,
  Input,
  Textarea,
  VStack,
  Portal,
  Popover,
  IconButton,
  HStack,
  Box,
  Text,
  Select,
  Fieldset,
  Field,
} from '@chakra-ui/react'
import { Plus, X } from 'lucide-react'
import { useCreateWorld } from '../hooks/queries'
import { useQueryClient } from '@tanstack/react-query'
import { createListCollection } from '@chakra-ui/react'
import { toaster } from './ui/toaster'

interface CreateWorldModalProps {
  onWorldCreated?: () => void
}

export const CreateWorldModal = ({ onWorldCreated }: CreateWorldModalProps) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string>('')

  const queryClient = useQueryClient()
  const createWorldMutation = useCreateWorld()

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
    setName('')
    setDescription('')
    setRules('')
    setTags([])
    setSelectedTag('')
  }

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const handleCreateWorld = async () => {
    if (!name.trim()) return

    try {
      await createWorldMutation.mutateAsync({
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

      onWorldCreated?.()
      handleClose()
    } catch (error) {
      console.error('Failed to create world:', error)
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)} size="lg">
      <Popover.Trigger asChild>
        <IconButton size="sm" variant="ghost" colorPalette="green">
          <Plus size={16} />
        </IconButton>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content width="400px">
            <Popover.Header>
              <Text>创建新世界</Text>
            </Popover.Header>
            <Popover.Body>
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
                    onClick={() => void handleCreateWorld()}
                    loading={createWorldMutation.isPending}
                    disabled={!name.trim()}
                    size="sm"
                    width="full"
                    colorPalette="blue"
                  >
                    创建世界
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
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
