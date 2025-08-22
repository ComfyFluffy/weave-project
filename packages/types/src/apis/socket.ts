import z from 'zod'
import { MessageTypeSchema } from '../message'

export const MessageSendInputSchema = z.object({
  channelId: z.string(),
  content: z.string().min(1).max(4000),
  characterId: z.string().optional(),
  type: MessageTypeSchema,
})
export type MessageSendInput = z.infer<typeof MessageSendInputSchema>
