/**
 * Image processing utilities for avatar handling
 */

/**
 * Check if a string is an emoji
 */
export function isEmoji(str: string): boolean {
  // Basic emoji detection - this covers most common emojis
  const emojiRegex =
    /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]$/u
  return emojiRegex.test(str.trim())
}

/**
 * Crop and resize an image to 128x128 JPG format
 */
export function cropAndResizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('无法创建canvas上下文'))
      return
    }

    img.onload = () => {
      const size = 128
      canvas.width = size
      canvas.height = size

      // Calculate crop dimensions to get center square
      const minDimension = Math.min(img.width, img.height)
      const cropX = (img.width - minDimension) / 2
      const cropY = (img.height - minDimension) / 2

      // Draw the cropped and resized image
      ctx.drawImage(
        img,
        cropX,
        cropY,
        minDimension,
        minDimension, // Source crop
        0,
        0,
        size,
        size // Destination
      )

      // Convert to JPG with 85% quality
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      resolve(dataUrl)
    }

    img.onerror = () => {
      reject(new Error('无法加载图片'))
    }

    // Create object URL for the image
    const objectUrl = URL.createObjectURL(file)
    img.src = objectUrl

    // Clean up object URL after image loads
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const size = 128
      canvas.width = size
      canvas.height = size

      // Calculate crop dimensions to get center square
      const minDimension = Math.min(img.width, img.height)
      const cropX = (img.width - minDimension) / 2
      const cropY = (img.height - minDimension) / 2

      // Draw the cropped and resized image
      ctx.drawImage(
        img,
        cropX,
        cropY,
        minDimension,
        minDimension, // Source crop
        0,
        0,
        size,
        size // Destination
      )

      // Convert to JPG with 85% quality
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      resolve(dataUrl)
    }
  })
}

/**
 * Validate file size and type
 */
export function validateImageFile(file: File): {
  isValid: boolean
  error?: string
} {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: '请选择有效的图片文件' }
  }

  // Check file size (max 5MB before processing)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: '图片文件大小不能超过5MB' }
  }

  return { isValid: true }
}
