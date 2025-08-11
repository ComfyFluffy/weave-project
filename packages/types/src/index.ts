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
import type { WorldState } from './state'

/** Generic ID type used for all entities */
export type Id = string // Each type with an ID is going to have a table in the database

/**
 * User represents a person using the platform
 * Users can be players or game masters
 */
export interface User {
  /** Unique identifier for the user */
  id: Id
  /** Display name of the user */
  displayName: string
  /** Optional avatar emoji or image URL */
  avatar?: string
}

export const ChannelTypeSchema = z.enum(['OOC', 'IC', 'ANNOUNCEMENT'])

export const ChannelType = ChannelTypeSchema.enum

export type ChannelType = z.infer<typeof ChannelTypeSchema>

/**
 * Channel represents a chat channel within a world
 * Channels are organized by type (announcement, OOC, IC) and belong to a specific world
 */
export interface Channel {
  /** Unique identifier for the channel */
  id: Id
  /** ID of the world this channel belongs to */
  worldId: World['id']
  /** Name of the channel (e.g., "general", "ooc-chat") */
  name: string
  /** Type of channel determining its purpose */
  type: ChannelType
  /** Optional description of the channel's purpose */
  description?: string
  /** ID of the world state associated with this channel */
  worldStateId?: WorldState['id']
}

export const ChannelSchema = z.object({
  id: z.string(),
  worldId: z.string(),
  name: z.string(),
  type: ChannelTypeSchema,
  description: z.string().optional(),
  worldStateId: z.string().optional(),
})

/**
 * World represents a complete game universe
 * Worlds contain channels, characters, and maintain their own world state
 */
export interface World {
  /** Unique identifier for the world */
  id: Id
  /** Name of the world/game */
  name: string
  /** Description of the world setting */
  description: string
  /** Tags categorizing the world (e.g., fantasy, sci-fi, horror) */
  tags: string[]
  /** Optional ruleset information */
  rules?: string
  /** List of channels in this world */
  channels: Channel[]
}

/**
 * Character represents a person or creature in the game world
 */
export interface Character {
  /** Unique identifier for the character */
  id: string
  /** Name of the character */
  name: string
  /** Description of the character's appearance/personality */
  description: string
  /** Optional avatar emoji or image URL */
  avatar?: string
}

/**
 * Message represents a chat message sent in a channel
 * Messages can be from users, characters, the system, or AI
 */
export interface Message {
  /** Unique identifier for the message */
  id: Id
  /** ID of the channel this message was sent to */
  channelId: Channel['id']
  /** ID of the user who sent the message */
  userId?: User['id']
  /** ID of the character associated with this message */
  characterId?: Character['id']
  /** Type determining how the message is displayed */
  type: MessageType
  /** Content/body of the message */
  content: string

  /** Timestamp when the message was created */
  createdAt: Date
  /** Timestamp when the message was last updated */
  updatedAt?: Date
}

export const MessageTypeSchema = z.enum(['CHARACTER', 'ACTION', 'SYSTEM', 'GM'])

export const MessageType = MessageTypeSchema.enum

export type MessageType = z.infer<typeof MessageTypeSchema>

export * from './state'
