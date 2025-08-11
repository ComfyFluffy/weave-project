import { z } from 'zod'
import { ChannelSchema } from '..'

// ===== Users (legacy simple interfaces kept for reference) =====
export const UserRegistrationRequestSchema = z.object({
  displayName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(1).max(100),
})

export const UserLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(100),
})

// ===== Worlds =====
export const WorldIdRequestParamSchema = z.object({ id: z.string().min(1) })
export type WorldIdRequestParam = z.infer<typeof WorldIdRequestParamSchema>

export const WorldCreateRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  tags: z.array(z.string()).default([]),
  rules: z.string().optional(),
  channels: z.array(ChannelSchema).default([]),
})
export type WorldCreateRequest = z.infer<typeof WorldCreateRequestSchema>

export const WorldUpdateRequestSchema = WorldCreateRequestSchema.partial()
export type WorldUpdateRequest = z.infer<typeof WorldUpdateRequestSchema>

// ===== AI Chat =====
export const AIMessageSchema = z.any()

export const AIChatRequestSchema = z.object({
  messages: z.array(AIMessageSchema),
  worldId: z.string().optional(),
  channelId: z.string().optional(),
  characterId: z.string().optional(),
  role: z.enum(['gm', 'player', 'spectator']).optional(),
})
export type AIChatBody = z.infer<typeof AIChatRequestSchema>
