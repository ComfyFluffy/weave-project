import z from 'zod'

export const MessageTypeSchema = z.enum(['character', 'action', 'system', 'gm'])
export type MessageType = z.infer<typeof MessageTypeSchema>

/**
 * Message represents a chat message sent in a channel
 * Messages can be from users, characters, the system, or AI
 */
export const MessageSchema = z.object({
  /** Unique identifier for the message */
  id: z.string(),
  /** ID of the channel this message was sent to */
  channelId: z.string(),
  /** ID of the user who sent the message */
  userId: z.string().optional(),
  /** ID of the character associated with this message */
  characterId: z.string().optional(),
  /** Type determining how the message is displayed */
  type: MessageTypeSchema,
  /** Content/body of the message */
  content: z.string(),
  /** Timestamp when the message was created */
  createdAt: z.date(),
  /** Timestamp when the message was last updated */
  updatedAt: z.date().optional(),
})
export type Message = z.infer<typeof MessageSchema>
