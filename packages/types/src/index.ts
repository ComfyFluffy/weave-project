/**
 * Type definitions for the Weave platform
 *
 * This file defines the core data structures that represent the state of our
 * collaborative storytelling platform. These types form the foundation of
 * both the frontend and backend implementations.
 *
 * Database Storage Strategy:
 * All complex WorldState data is stored as a single JSON object in the database
 * to simplify management of flexible, nested data structures. This approach
 * combines the benefits of relational databases (for core entities) with the
 * flexibility of document databases (for complex game state data).
 */

import z from 'zod'

/** Generic ID type used for all entities */
export type Id = string // Each type with an ID is going to have a table in the database

/**
 * User represents a person using the platform
 * Users can be players or game masters
 */
export const UserSchema = z.object({
  /** Unique identifier for the user */
  id: z.string(),
  /** Display name of the user */
  displayName: z.string(),
  /** Optional avatar emoji or image URL */
  avatar: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>

/**
 * Channel represents a chat channel within a world
 * Channels are organized by type (announcement, OOC, IC) and belong to a specific world
 */
export const ChannelTypeSchema = z.enum(['ooc', 'ic', 'announcement'])
export type ChannelType = z.infer<typeof ChannelTypeSchema>

export const ChannelSchema = z.object({
  id: z.string(),
  worldId: z.string(),
  name: z.string(),
  type: ChannelTypeSchema,
  description: z.string().optional(),
  worldStateId: z.string().optional(),
})
export type Channel = z.infer<typeof ChannelSchema>
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
/**
 * Character represents a person or creature in the game world
 */
export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  avatar: z.string().optional(),
})
export type Character = z.infer<typeof CharacterSchema>

/**
 * Message represents a chat message sent in a channel
 * Messages can be from users, characters, the system, or AI
 */
export const MessageTypeSchema = z.enum(['character', 'action', 'system', 'gm'])
export const MessageSchema = z.object({
  /** Unique identifier for the message */
  id: z.string(),
  /** ID of the channel this message was sent to */
  channelId: ChannelSchema.shape.id,
  /** ID of the user who sent the message */
  userId: UserSchema.shape.id.optional(),
  /** ID of the character associated with this message */
  characterId: CharacterSchema.shape.id.optional(),
  /** Type determining how the message is displayed */
  type: MessageTypeSchema,
  /** Content/body of the message */
  content: z.string(),
  /** Timestamp when the message was created */
  createdAt: z.date(),
  /** Timestamp when the message was last updated */
  updatedAt: z.date().optional(),
})
export type MessageType = z.infer<typeof MessageTypeSchema>
export type Message = z.infer<typeof MessageSchema>

const LiteralSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof LiteralSchema>

type json = Literal | { [key: string]: json } | json[]

const JsonSchema: z.ZodType<json> = z.lazy(() =>
  z.union([LiteralSchema, z.array(JsonSchema), z.record(JsonSchema)])
)
export type Json = z.infer<typeof JsonSchema>
export * from './state'
