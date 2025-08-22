/**
 * Request/Response type definitions for the Weave platform
 *
 * This module contains types used for API requests, authentication,
 * and other client-server communication.
 */

import z from 'zod'

export * from './contracts'
export * from './common'
export * from './socket'

export const AIMessageSchema = z.any()

export const AIChatRequestSchema = z.object({
  messages: z.array(AIMessageSchema),
  worldId: z.string().optional(),
  channelId: z.string().optional(),
  characterId: z.string().optional(),
  role: z.enum(['gm', 'player', 'spectator']).optional(),
})
export type AIChatRequest = z.infer<typeof AIChatRequestSchema>

export interface JwtPayload {
  userId: string
}
