// UI Constants
export const MESSAGE_GROUPING_TIME_THRESHOLD = 300000 // 5 minutes in milliseconds

export const COLORS = {
  messageTypes: {
    system: 'blue.400',
    ai: 'purple.400',
    action: 'green.400',
    user: 'white',
  },
  authorTypes: {
    system: 'blue.500',
    ai: 'purple.500',
    action: 'green.500',
    user: 'gray.500',
  },
  roles: {
    gm: 'purple.400',
    player: 'green.400',
    spectator: 'gray.400',
  },
} as const

export const TYPING_INDICATOR_TIMEOUT = 1000 // 1 second

export const LAYOUT = {
  worldSidebarWidth: '72px',
  channelSidebarWidth: '240px',
  memberListWidth: '240px',
} as const
