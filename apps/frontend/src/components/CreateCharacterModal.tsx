import { useState, useCallback } from 'react'
import {
  Button,
  Input,
  Textarea,
  VStack,
  Portal,
  Dialog,
  Image,
  Box,
  Text,
} from '@chakra-ui/react'
import { Plus } from 'lucide-react'

interface CreateCharacterModalProps {
  worldId: string
  isOpen: boolean
  onClose: () => void
  onCreateCharacter: (character: { name: string; description: string; avatar?: string }) => void
}

export const CreateCharacterModal = ({
  worldId,
  isOpen,
  onClose,
  onCreateCharacter,
}: CreateCharacterModalProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const resetForm = useCallback(() => {
    setName('')
    setDescription('')
    setAvatar(null)
    setAvatarPreview(null)
    setError(null)
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('请选择有效的图片文件')
        return
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('图片文件大小不能超过2MB')
        return
      }
      
      setAvatar(file)
      setError(null)
      
      // Generate preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setAvatar(null)
      setAvatarPreview(null)
    }
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('请输入角色名称')
      return
    }
    
    // If an avatar file is selected, convert it to base64
    if (avatar) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onCreateCharacter({
          name: name.trim(),
          description: description.trim(),
          avatar: reader.result as string,
        })
        resetForm()
        onClose()
      }
      reader.readAsDataURL(avatar)
    } else {
      // No avatar file selected
      onCreateCharacter({
        name: name.trim(),
        description: description.trim(),
      })
      resetForm()
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content width="400px">
            <Dialog.Header>创建新角色</Dialog.Header>
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
                    角色名称
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="输入角色名称"
                    size="sm"
                    autoFocus
                    onKeyDown={handleKeyDown}
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
                    角色描述
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="描述你的角色（可选）"
                    resize="none"
                    rows={3}
                    size="sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleSubmit()
                      }
                    }}
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
                    角色图片（可选）
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    size="sm"
                  />
                  {error && (
                    <Text color="red.400" fontSize="sm" mt={1}>
                      {error}
                    </Text>
                  )}
                  
                  {avatarPreview && (
                    <Box mt={2} display="flex" justifyContent="center">
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        borderRadius="full"
                        boxSize="100px"
                        objectFit="cover"
                      />
                    </Box>
                  )}
                </div>

                <VStack gap={2} mt={2}>
                  <Button
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    size="sm"
                    width="full"
                    colorPalette="blue"
                  >
                    创建角色
                  </Button>
                  <Button
                    onClick={() => {
                      resetForm()
                      onClose()
                    }}
                    variant="outline"
                    size="sm"
                    width="full"
                  >
                    取消
                  </Button>
                </VStack>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}