import z from 'zod'
import { ChannelSchema } from './channel'

/**
 * World represents a complete game universe
 * Worlds contain channels, characters, and maintain their own world state
 */
export const WorldSchema = z.object({
  /** Unique identifier for the world */
  id: z.string(),
  /** Name of the world/game */
  name: z.string(),
  /** Description of the world setting */
  description: z.string(),
  /** Tags categorizing the world (e.g., fantasy, sci-fi, horror) */
  tags: z.array(z.string()),
  /** Optional ruleset information */
  rules: z.string().optional(),
  /** List of channels in this world */
  channels: z.array(ChannelSchema),
})
export type World = z.infer<typeof WorldSchema>
