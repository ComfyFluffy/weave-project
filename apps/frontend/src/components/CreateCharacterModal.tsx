import { Dialog, Portal } from '@chakra-ui/react'
import { CharacterForm } from './character-form'
import { useCreateCharacter } from '../hooks/queries'
import type { Character } from '@weave/types'

interface CreateCharacterModalProps {
  open: boolean
  onClose: () => void
  onCharacterCreated?: (character: Character) => void
}

export const CreateCharacterModal = ({
  open,
  onClose,
  onCharacterCreated,
}: CreateCharacterModalProps) => {
  const createCharacterMutation = useCreateCharacter()

  const handleSubmit = async (data: {
    name: string
    description: string
    avatar?: string
  }) => {
    try {
      const response = await createCharacterMutation.mutateAsync({
        body: {
          name: data.name,
          description: data.description,
          avatar: data.avatar,
        },
      })
      onCharacterCreated?.(response.body.character)
      onClose()
    } catch (error) {
      console.error('Error creating character:', error)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>创建角色</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <CharacterForm
                character={null}
                onSubmit={(e) => void handleSubmit(e)}
                onCancel={onClose}
                isLoading={createCharacterMutation.isPending}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
