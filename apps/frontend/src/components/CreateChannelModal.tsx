import { useState } from 'react'
import {
  Button,
  Input,
  Select,
  Textarea,
  VStack,
  Portal,
  Popover,
  createListCollection,
  IconButton,
} from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { useCreateChannel } from '../hooks/useChannels'

interface CreateChannelModalProps {
  worldId: string
}

const channelTypes = createListCollection({
  items: [
    { label: '角色扮演 (IC)', value: 'ic' },
    { label: '脱离角色 (OOC)', value: 'ooc' },
  ],
})

export const CreateChannelModal = ({ worldId }: CreateChannelModalProps) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState(['ic'])
  const [description, setDescription] = useState('')

  const createChannelMutation = useCreateChannel(worldId)

  const handleSubmit = async () => {
    if (!name.trim()) return

    try {
      await createChannelMutation.mutateAsync({
        name: name.trim(),
        type: type[0],
        description: description.trim() || undefined,
      })

      setName('')
      setType(['ic'])
      setDescription('')
      setOpen(false)
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
                    频道类型
                  </label>
                  <Select.Root
                    collection={channelTypes}
                    value={type}
                    onValueChange={(e) => setType(e.value)}
                    size="sm"
                    positioning={{ sameWidth: true, placement: 'bottom' }}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="选择频道类型" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content width="full">
                        {channelTypes.items.map((channelType) => (
                          <Select.Item
                            item={channelType}
                            key={channelType.value}
                          >
                            {channelType.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
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
                    onClick={() => void handleSubmit()}
                    loading={createChannelMutation.isPending}
                    disabled={!name.trim()}
                    size="sm"
                    width="full"
                    colorPalette="blue"
                  >
                    创建频道
                  </Button>
                  <Button
                    onClick={() => setOpen(false)}
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
