import { useState, useCallback } from 'react'
import {
  VStack,
  Box,
  Text,
  Button,
  Input,
  Image,
  Avatar,
  Portal,
  Popover,
  Flex,
  HStack,
} from '@chakra-ui/react'
import { Upload, Save, X } from 'lucide-react'
import { useCurrentUser } from '../hooks/auth'
import { useUpdateUser } from '../hooks/queries'
import { useQueryClient } from '@tanstack/react-query'
import { toaster } from './ui/toaster'
import { cropAndResizeImage, validateImageFile, isEmoji } from '../utils/image'

interface UserProfilePopoverProps {
  children: React.ReactNode
}

export function UserProfilePopover({ children }: UserProfilePopoverProps) {
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [emojiInput, setEmojiInput] = useState('')
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: currentUserResponse } = useCurrentUser()
  const updateUserMutation = useUpdateUser()
  const queryClient = useQueryClient()

  const currentUser =
    currentUserResponse?.status === 200 ? currentUserResponse.body.user : null

  const resetForm = useCallback(() => {
    setDisplayName(currentUser?.displayName || '')
    setAvatar(null)
    setAvatarPreview(null)
    setEmojiInput('')
    setIsProcessingImage(false)
    setError(null)
    setIsEditing(false)
  }, [currentUser])

  const handleOpenEdit = () => {
    setDisplayName(currentUser?.displayName || '')
    setAvatarPreview(currentUser?.avatar || null)
    // If current avatar is an emoji, set it in the emoji input
    if (currentUser?.avatar && isEmoji(currentUser.avatar)) {
      setEmojiInput(currentUser.avatar)
    } else {
      setEmojiInput('')
    }
    setIsEditing(true)
    setError(null)
  }

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
      setAvatarPreview(currentUser?.avatar || null)
    }
  }

  const handleEmojiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmojiInput(value)

    if (value.trim() === '') {
      setAvatarPreview(null)
    } else if (isEmoji(value.trim())) {
      setAvatarPreview(value.trim())
      setAvatar(null) // Clear file when emoji is selected
      setError(null)
    } else {
      setError('请输入有效的表情符号')
    }
  }

  const handleSave = () => {
    if (!displayName.trim()) {
      setError('请输入显示名称')
      return
    }

    try {
      // Prepare update data
      const updateData: { displayName?: string; avatar?: string } = {}

      if (displayName.trim() !== currentUser?.displayName) {
        updateData.displayName = displayName.trim()
      }

      // Handle avatar update
      if (avatar && avatarPreview) {
        // If an image file was processed, use the processed data
        updateData.avatar = avatarPreview
        performUpdate(updateData)
      } else if (emojiInput.trim() && isEmoji(emojiInput.trim())) {
        // If emoji was entered, use it
        updateData.avatar = emojiInput.trim()
        performUpdate(updateData)
      } else if (avatarPreview !== currentUser?.avatar) {
        // If preview changed but no new file/emoji, it means user cleared the avatar
        updateData.avatar = avatarPreview || ''
        performUpdate(updateData)
      } else if (Object.keys(updateData).length > 0) {
        // Only display name changed
        performUpdate(updateData)
      } else {
        // No changes
        resetForm()
      }
    } catch (error) {
      console.error('Error processing avatar:', error)
      setError('处理头像时出错')
    }
  }

  const performUpdate = (updateData: {
    displayName?: string
    avatar?: string
  }) => {
    updateUserMutation.mutate(
      { body: updateData },
      {
        onSuccess: () => {
          resetForm()
          toaster.success({
            title: '个人资料更新成功',
            duration: 3000,
          })
          // Invalidate and refetch current user data
          void queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        },
        onError: (error) => {
          console.error('Failed to update user:', error)
          setError('更新个人资料失败')
        },
      }
    )
  }

  if (!currentUser) {
    return <>{children}</>
  }

  return (
    <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content width="320px">
            <Popover.Header>
              <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="bold">
                  个人资料
                </Text>
                {!isEditing && (
                  <Button size="sm" variant="ghost" onClick={handleOpenEdit}>
                    编辑
                  </Button>
                )}
              </Flex>
            </Popover.Header>
            <Popover.Body>
              <VStack gap={4} align="stretch">
                {/* Avatar Section */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={2}
                >
                  <Avatar.Root size="xl">
                    {(() => {
                      const avatarSrc = isEditing
                        ? avatarPreview
                        : currentUser.avatar

                      if (avatarSrc) {
                        // Check if it's an emoji
                        if (isEmoji(avatarSrc)) {
                          return (
                            <Avatar.Fallback
                              name={currentUser.displayName}
                              fontSize="2xl"
                              bg="transparent"
                            >
                              {avatarSrc}
                            </Avatar.Fallback>
                          )
                        } else {
                          // It's an image URL/data URL
                          return (
                            <Image
                              src={avatarSrc}
                              alt={currentUser.displayName}
                              borderRadius="full"
                              objectFit="cover"
                              width="full"
                              height="full"
                            />
                          )
                        }
                      } else {
                        // No avatar, show first letter
                        return (
                          <Avatar.Fallback name={currentUser.displayName}>
                            {currentUser.displayName[0]}
                          </Avatar.Fallback>
                        )
                      }
                    })()}
                  </Avatar.Root>

                  {isEditing && (
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
                  )}
                </Box>

                {/* Display Name */}
                <VStack gap={1} align="stretch">
                  <Text fontSize="sm" fontWeight="medium" color="gray.400">
                    显示名称
                  </Text>
                  {isEditing ? (
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="输入显示名称"
                      size="sm"
                    />
                  ) : (
                    <Text fontSize="md">{currentUser.displayName}</Text>
                  )}
                </VStack>

                {/* User ID (Read-only) */}
                <VStack gap={1} align="stretch">
                  <Text fontSize="sm" fontWeight="medium" color="gray.400">
                    用户ID
                  </Text>
                  <Text fontSize="sm" color="gray.500" fontFamily="mono">
                    {currentUser.id}
                  </Text>
                </VStack>

                {/* Error message */}
                {error && (
                  <Text color="red.400" fontSize="sm">
                    {error}
                  </Text>
                )}

                {/* Action Buttons */}
                {isEditing ? (
                  <Flex gap={2}>
                    <Button
                      flex={1}
                      size="sm"
                      colorPalette="blue"
                      onClick={handleSave}
                      loading={updateUserMutation.isPending}
                      disabled={!displayName.trim()}
                    >
                      <Save size={14} />
                      保存
                    </Button>
                    <Button
                      flex={1}
                      size="sm"
                      variant="outline"
                      onClick={resetForm}
                    >
                      <X size={14} />
                      取消
                    </Button>
                  </Flex>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    width="full"
                  >
                    关闭
                  </Button>
                )}
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
