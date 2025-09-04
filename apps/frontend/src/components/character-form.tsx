import { useState, useEffect } from 'react'
import {
  VStack,
  Box,
  Text,
  Button,
  Input,
  Textarea,
  Avatar,
  Image,
  HStack,
  Flex,
} from '@chakra-ui/react'
import { Upload, Save, X } from 'lucide-react'
import { cropAndResizeImage, validateImageFile, isEmoji } from '../utils/image'
import type { Character } from '@weave/types'

interface CharacterFormProps {
  character?: Character | null // null for create, Character for edit
  onSubmit: (data: {
    name: string
    description: string
    avatar?: string
  }) => void
  onCancel: () => void
  isLoading?: boolean
}

export function CharacterForm({
  character,
  onSubmit,
  onCancel,
  isLoading = false,
}: CharacterFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [emojiInput, setEmojiInput] = useState('')
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!character

  // Initialize form with character data if editing
  useEffect(() => {
    if (character) {
      setName(character.name)
      setDescription(character.description || '')
      setAvatarPreview(character.avatar || null)

      // If current avatar is an emoji, set it in the emoji input
      if (character.avatar && isEmoji(character.avatar)) {
        setEmojiInput(character.avatar)
      } else {
        setEmojiInput('')
      }
    } else {
      // Reset form for create mode
      setName('')
      setDescription('')
      setAvatarPreview(null)
      setEmojiInput('')
    }
    setAvatar(null)
    setError(null)
    setIsProcessingImage(false)
  }, [character])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        setError(validation.error || '文件验证失败')
        return
      }

      setIsProcessingImage(true)
      setError(null)

      try {
        // Crop and resize image to 128x128 JPG
        const processedImageDataUrl = await cropAndResizeImage(file)
        setAvatarPreview(processedImageDataUrl)
        setAvatar(file) // Keep original file reference (though we'll use processed data)
        setEmojiInput('') // Clear emoji input when image is selected
      } catch (error) {
        console.error('Image processing error:', error)
        setError('图片处理失败，请重试')
      } finally {
        setIsProcessingImage(false)
      }
    } else {
      setAvatar(null)
      setAvatarPreview(character?.avatar || null)
    }
  }

  const handleEmojiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmojiInput(value)

    if (value.trim() === '') {
      setAvatarPreview(character?.avatar || null)
    } else if (isEmoji(value.trim())) {
      setAvatarPreview(value.trim())
      setAvatar(null) // Clear file when emoji is selected
      setError(null)
    } else {
      setError('请输入有效的表情符号')
    }
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('请输入角色名称')
      return
    }

    try {
      const submitData: { name: string; description: string; avatar?: string } =
        {
          name: name.trim(),
          description: description.trim(),
        }

      // Handle avatar update
      if (avatar && avatarPreview) {
        // If an image file was processed, use the processed data
        submitData.avatar = avatarPreview
      } else if (emojiInput.trim() && isEmoji(emojiInput.trim())) {
        // If emoji was entered, use it
        submitData.avatar = emojiInput.trim()
      } else if (avatarPreview !== (character?.avatar || null)) {
        // If preview changed but no new file/emoji, it means user cleared the avatar
        submitData.avatar = avatarPreview || ''
      }

      onSubmit(submitData)
    } catch (error) {
      console.error('Error processing form:', error)
      setError('处理表单时出错')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <VStack gap={4} align="stretch">
      {/* Avatar Section */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Avatar.Root size="xl">
          {(() => {
            if (avatarPreview) {
              // Check if it's an emoji
              if (isEmoji(avatarPreview)) {
                return (
                  <Avatar.Fallback
                    name={name || 'Character'}
                    fontSize="2xl"
                    bg="transparent"
                  >
                    {avatarPreview}
                  </Avatar.Fallback>
                )
              } else {
                // It's an image URL/data URL
                return (
                  <Image
                    src={avatarPreview}
                    alt={name || 'Character'}
                    borderRadius="full"
                    objectFit="cover"
                    width="full"
                    height="full"
                  />
                )
              }
            } else {
              // No avatar, show first letter of name
              return (
                <Avatar.Fallback name={name || 'Character'}>
                  {name ? name[0] : '?'}
                </Avatar.Fallback>
              )
            }
          })()}
        </Avatar.Root>

        <VStack gap={2} width="full">
          {/* Image Upload */}
          <HStack gap={2} width="full">
            <label style={{ flex: 1 }}>
              <Button
                as="span"
                size="sm"
                variant="outline"
                cursor="pointer"
                width="full"
                loading={isProcessingImage}
              >
                <Upload size={14} />
                上传图片
              </Button>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => void handleAvatarChange(e)}
                display="none"
              />
            </label>
          </HStack>

          {/* Emoji Input */}
          <VStack gap={1} width="full">
            <Text fontSize="xs" color="gray.400">
              或使用表情符号
            </Text>
            <Input
              value={emojiInput}
              onChange={handleEmojiChange}
              placeholder="🙂"
              size="sm"
              textAlign="center"
              maxLength={2}
            />
          </VStack>

          {/* Clear Avatar Button */}
          {(avatarPreview || emojiInput) && (
            <Button
              size="xs"
              variant="ghost"
              colorPalette="red"
              onClick={() => {
                setAvatarPreview(null)
                setAvatar(null)
                setEmojiInput('')
              }}
            >
              清除头像
            </Button>
          )}
        </VStack>
      </Box>

      {/* Name Input */}
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
          autoFocus={!isEditing}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Description Input */}
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

      {/* Error message */}
      {error && (
        <Text color="red.400" fontSize="sm">
          {error}
        </Text>
      )}

      {/* Action Buttons */}
      <Flex gap={2}>
        <Button
          flex={1}
          size="sm"
          colorPalette="blue"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!name.trim()}
        >
          <Save size={14} />
          {isEditing ? '保存' : '创建角色'}
        </Button>
        <Button flex={1} size="sm" variant="outline" onClick={onCancel}>
          <X size={14} />
          取消
        </Button>
      </Flex>
    </VStack>
  )
}
