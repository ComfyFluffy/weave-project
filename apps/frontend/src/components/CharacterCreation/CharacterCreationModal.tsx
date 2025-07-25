import {
  Button,
  Dialog,
  CloseButton,
  Portal,
  Input,
  Fieldset,
  NumberInput,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import type { PlayerCharacter } from '@weave/types'

interface CharacterCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateCharacter: (character: Omit<PlayerCharacter, 'id'>) => void
}

export function CharacterCreationModal({
  isOpen,
  onClose,
  onCreateCharacter,
}: CharacterCreationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    hp: 100,
    maxHp: 100,
    location: '起始地点',
    inventory: [] as string[],
    description: '',
  })

  const [inventoryInput, setInventoryInput] = useState('')

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.class.trim()) {
      return
    }

    const character: Omit<PlayerCharacter, 'id'> = {
      name: formData.name.trim(),
      class: formData.class.trim(),
      hp: formData.hp,
      maxHp: formData.maxHp,
      location: formData.location.trim(),
      inventory: inventoryInput
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    }

    onCreateCharacter(character)
    onClose()

    // Reset form
    setFormData({
      name: '',
      class: '',
      hp: 100,
      maxHp: 100,
      location: '起始地点',
      inventory: [],
      description: '',
    })
    setInventoryInput('')
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxWidth="md">
            <Dialog.Header>
              <Dialog.Title>创建角色</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={4} align="stretch">
                <Fieldset.Root>
                  <Fieldset.Legend>基本信息</Fieldset.Legend>
                  <VStack gap={3} align="stretch">
                    <Fieldset.Content>
                      <Fieldset.Legend>角色姓名 *</Fieldset.Legend>
                      <Input
                        id="name"
                        placeholder="输入角色姓名"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </Fieldset.Content>

                    <Fieldset.Content>
                      <Fieldset.Legend>职业 *</Fieldset.Legend>
                      <Input
                        id="class"
                        placeholder="例如：战士、法师、盗贼"
                        value={formData.class}
                        onChange={(e) =>
                          setFormData({ ...formData, class: e.target.value })
                        }
                      />
                    </Fieldset.Content>

                    <Fieldset.Content>
                      <Fieldset.Legend>起始位置</Fieldset.Legend>
                      <Input
                        id="location"
                        placeholder="角色的起始位置"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                    </Fieldset.Content>
                  </VStack>
                </Fieldset.Root>

                <Fieldset.Root>
                  <Fieldset.Legend>属性</Fieldset.Legend>
                  <HStack>
                    <Fieldset.Content flex={1}>
                      <Fieldset.Legend>当前生命值</Fieldset.Legend>
                      <NumberInput.Root
                        id="hp"
                        value={formData.hp.toString()}
                        onValueChange={(e) =>
                          setFormData({
                            ...formData,
                            hp: parseInt(e.value) || 0,
                          })
                        }
                        min={0}
                        max={formData.maxHp}
                      >
                        <NumberInput.Input />
                      </NumberInput.Root>
                    </Fieldset.Content>

                    <Fieldset.Content flex={1}>
                      <Fieldset.Legend>最大生命值</Fieldset.Legend>
                      <NumberInput.Root
                        id="maxHp"
                        value={formData.maxHp.toString()}
                        onValueChange={(e) => {
                          const maxHp = parseInt(e.value) || 100
                          setFormData({
                            ...formData,
                            maxHp,
                            hp: Math.min(formData.hp, maxHp),
                          })
                        }}
                        min={1}
                      >
                        <NumberInput.Input />
                      </NumberInput.Root>
                    </Fieldset.Content>
                  </HStack>
                </Fieldset.Root>

                <Fieldset.Root>
                  <Fieldset.Legend>物品栏</Fieldset.Legend>
                  <Fieldset.Content>
                    <Fieldset.Legend>初始物品</Fieldset.Legend>
                    <Input
                      id="inventory"
                      placeholder="用逗号分隔物品，例如：长剑,治疗药水,魔法书"
                      value={inventoryInput}
                      onChange={(e) => setInventoryInput(e.target.value)}
                    />
                    <Fieldset.HelperText>
                      用逗号分隔多个物品
                    </Fieldset.HelperText>
                  </Fieldset.Content>
                </Fieldset.Root>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onClose}>
                  取消
                </Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.class.trim()}
              >
                创建角色
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
