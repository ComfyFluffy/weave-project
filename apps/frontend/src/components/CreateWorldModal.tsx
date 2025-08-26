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
  Dialog,
  Menu,
  Separator,
} from '@chakra-ui/react'
import { Plus, X } from 'lucide-react'
import { useCreateWorld, useWorlds } from '../hooks/queries'
import { useQueryClient } from '@tanstack/react-query'
import { toaster } from '../components/ui/toaster'
import { ConfirmDialog } from '../components/ConfirmDialog'

interface CreateWorldModalProps {
  onWorldCreated?: () => void
}

export const CreateWorldModal = ({ onWorldCreated }: CreateWorldModalProps) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  const queryClient = useQueryClient()
  const createWorldMutation = useCreateWorld()
  const { data: worldsData } = useWorlds()

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
    setName('')
    setDescription('')
    setRules('')
    setTags([])
    setNewTag('')
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
    <>
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

    </>
  )
}
