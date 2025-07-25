import { useRef, useEffect } from 'react'

export function useTypingIndicator(
  onStartTyping?: () => void,
  onStopTyping?: () => void,
  timeout: number = 1000
) {
  const typingTimeoutRef = useRef<number | null>(null)

  const handleTypingStart = (hasContent: boolean) => {
    if (hasContent && !typingTimeoutRef.current) {
      onStartTyping?.()
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping?.()
      typingTimeoutRef.current = null
    }, timeout)
  }

  const handleTypingStop = () => {
    onStopTyping?.()
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return { handleTypingStart, handleTypingStop }
}
