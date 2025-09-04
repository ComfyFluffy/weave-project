import { useState } from 'react'
import {
  Button,
  Input,
  Textarea,
  VStack,
  Portal,
  Popover,
  IconButton,
} from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { useCreateChannel } from '../hooks/queries'
import { useQueryClient } from '@tanstack/react-query'

interface CreateChannelModalProps {
  worldId: string
}

export const CreateChannelModal = ({ worldId }: CreateChannelModalProps) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState(['ic'])
  const [description, setDescription] = useState('')

  const queryClient = useQueryClient()
  const createChannelMutation = useCreateChannel()

  const resetForm = () => {
    setName('')
    setType(['ic'])
    setDescription('')
  }

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const handleCreateChannel = async () => {
    if (!name.trim()) return

    try {
      await createChannelMutation.mutateAsync({
        body: {
          worldId,
          name: name.trim(),
          type: type[0] as 'ic' | 'ooc' | 'announcement',
          description: description.trim(),
        },
      })

      // Invalidate and refetch channels
      await queryClient.invalidateQueries({
        queryKey: ['channels', worldId],
      })

      handleClose()
    } catch (error) {
      console.error('Failed to create channel:', error)
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)} size="sm">
      <Popover.Trigger asChild>
        <IconButton size="sm" variant="ghost" colorPalette="gray">
          <Plus size={16} />
        </IconButton>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content width="320px">
            <Popover.Header>创建新频道</Popover.Header>
            <Popover.Body>
              <VStack gap={3} align="stretch">
                <div>
                  <label
                    style={{
                      fontSize: '14px',
                      marginBottom: '4px',
                      display: 'block',
                    }}
                  >
                    频道名称
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="输入频道名称"
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
                    描述 (可选)
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="输入频道描述"
                    resize="none"
                    rows={2}
                    size="sm"
                  />
                </div>

                <VStack gap={2} mt={2}>
                  <Button
                    onClick={() => void handleCreateChannel()}
                    loading={createChannelMutation.isPending}
                    disabled={!name.trim()}
                    size="sm"
                    width="full"
                    colorPalette="blue"
                  >
                    创建频道
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
