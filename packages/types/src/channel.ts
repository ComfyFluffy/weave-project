import z from 'zod'

export const ChannelTypeSchema = z.enum(['ooc', 'ic', 'announcement'])
export type ChannelType = z.infer<typeof ChannelTypeSchema>

/**
 * Channel represents a chat channel within a world
 * Channels are organized by type (announcement, OOC, IC) and belong to a specific world
 */
export const ChannelSchema = z.object({
  id: z.string(),
  worldId: z.string(),
  name: z.string(),
  type: ChannelTypeSchema,
  description: z.string().optional(),
  worldStateId: z.string(),
})
export type Channel = z.infer<typeof ChannelSchema>
