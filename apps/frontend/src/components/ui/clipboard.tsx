import { useState } from 'react'
import { Button, IconButton } from '@chakra-ui/react'
import { Tooltip } from './tooltip'
import { toaster } from './toaster'
import { Copy, Check } from 'lucide-react'

interface ClipboardProps {
  text: string
  variant?: 'button' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  tooltip?: string
}

export function Clipboard({
  text,
  variant = 'icon',
  size = 'md',
  label = 'Copy',
  tooltip = 'Copy to clipboard',
}: ClipboardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)

        // Show success toast
        toaster.create({
          title: 'Copied to clipboard',
          type: 'success',
          duration: 2000,
        })

        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err)
        toaster.create({
          title: 'Failed to copy',
          description: 'Could not copy text to clipboard',
          type: 'error',
          duration: 3000,
        })
      })
  }

  if (variant === 'button') {
    return (
      <Tooltip content={tooltip}>
        <Button size={size} onClick={copyToClipboard} variant="outline">
          {copied ? (
            <>
              <Check size={16} />
              <span style={{ marginLeft: '8px' }}>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span style={{ marginLeft: '8px' }}>{label}</span>
            </>
          )}
        </Button>
      </Tooltip>
    )
  }

  return (
    <Tooltip content={tooltip}>
      <IconButton
        aria-label={label}
        size={size}
        onClick={copyToClipboard}
        variant="ghost"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </IconButton>
    </Tooltip>
  )
}
