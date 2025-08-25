import {
  Button,
  VStack,
  Portal,
  Dialog,
  Text,
} from '@chakra-ui/react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
}: ConfirmDialogProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content width="400px">
            <Dialog.Header>{title}</Dialog.Header>
            <Dialog.Body>
              <Text color="white">{message}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <VStack gap={2} width="full">
                <Button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  colorScheme="red"
                  width="full"
                >
                  {confirmText}
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  width="full"
                >
                  {cancelText}
                </Button>
              </VStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}