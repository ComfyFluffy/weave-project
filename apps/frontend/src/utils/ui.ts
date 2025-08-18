import type { Message } from '@weave/types'
import { COLORS } from '../constants/ui'

export const getMessageColor = (type: string) => {
  return (
    COLORS.messageTypes[type as keyof typeof COLORS.messageTypes] ||
    COLORS.messageTypes.user
  )
}

export const getAuthorColor = (type: string) => {
  return (
    COLORS.authorTypes[type as keyof typeof COLORS.authorTypes] ||
    COLORS.authorTypes.user
  )
}

export const getRoleColor = (role: string) => {
  return COLORS.roles[role as keyof typeof COLORS.roles] || COLORS.roles.player
}

export const getRoleLabel = (role: string) => {
  const labels = {
    gm: '主持人',
    player: '玩家',
    spectator: '观察者',
  }
  return labels[role as keyof typeof labels] || ''
}

export const getStatusColor = (hp: number, maxHp: number) => {
  const ratio = hp / maxHp
  if (ratio > 0.7) return 'green.400'
  if (ratio > 0.3) return 'yellow.400'
  return 'red.400'
}

export const formatTimestamp = (timestamp: Date) => {
  try {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInMinutes = Math.floor(
      (now.getTime() - messageTime.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 1) return '刚刚'
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`
    return `${Math.floor(diffInMinutes / 1440)}天前`
  } catch {
    return '刚刚'
  }
}

export const shouldShowAvatar = (
  currentMessage: Message,
  previousMessage: Message | null,
  timeThreshold: number = 300000
) => {
  if (!previousMessage) return true

  // Group messages by userId, characterId, AND type
  return (
    previousMessage.userId !== currentMessage.userId ||
    previousMessage.characterId !== currentMessage.characterId ||
    previousMessage.type !== currentMessage.type ||
    new Date(currentMessage.createdAt).getTime() -
      new Date(previousMessage.createdAt).getTime() >
      timeThreshold
  )
}
