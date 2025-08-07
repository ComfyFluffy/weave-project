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
 *
 * Specifically, these fields are stored together in a single `data` JSON field:
 * - keyEventsLog (Event[])
 * - locations (Location[])
 * - plots (Plot[])
 * - lore (Lore[])
 * - characters (Character[])
 * - characterStates (Record<Character['id'], CharacterState>)
 * - items (Record<Item['key'], Item>)
 * - itemTemplates (ItemTemplate[])
 */

/** Generic ID type used for all entities */
type Id = string // Each type with an ID is going to have a table in the database

/**
 * User represents a person using the platform
 * Users can be players or game masters
 */
export interface User {
  /** Unique identifier for the user */
  id: Id
  /** Display name of the user */
  username: string
  /** User's email address */
  email: string
  /** Hashed password */
  password: string
  /** Optional avatar emoji or image URL */
  avatar?: string
}

/**
 * UserRegistration represents the data needed to register a new user
 */
export interface UserRegistration {
  /** Display name of the user */
  username: string
  /** User's email address */
  email: string
  /** Plain text password (will be hashed on server) */
  password: string
}

/**
 * UserLogin represents the data needed to authenticate a user
 */
export interface UserLogin {
  /** User's email address */
  email: string
  /** Plain text password */
  password: string
}

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
  type: 'announcement' | 'ooc' | 'ic'
  /** Optional description of the channel's purpose */
  description?: string
  /** ID of the user who created this channel */
  createdBy?: User['id']
  /** Timestamp when the channel was created */
  createdAt?: Date
  /** ID of the world state associated with this channel */
  worldStateId?: WorldState['id']
}

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
 * WorldState represents the complete dynamic state of a world
 * This is the core of our intelligent storytelling system, maintaining
 * all the structured data about characters, locations, plots, and events
 *
 * Database Storage:
 * All complex data is stored as a single JSON object in the database
 * to simplify management of flexible, nested data structures.
 *
 * Relationships:
 * - One WorldState belongs to one World
 * - One World can have multiple WorldStates (for different timelines/save points)
 * - WorldState contains collections of Characters, Locations, Plots, etc.
 * - Characters have CharacterStates that track their individual progress
 */
export interface WorldState {
  /** Unique identifier for the world state */
  id: Id
  /** ID of the world this state belongs to */
  worldId: World['id']

  // ===== Core Entity Collections (Stored together in single JSON field) =====

  /** All characters in this world */
  characters: Character[]
  /** Timeline of important events in the world */
  keyEventsLog: Event[]
  /** Detailed state information for each character */
  characterStates: Record<Character['id'], CharacterState>
  /** All locations in the world */
  locations: Location[]
  /** All items in the world, keyed by unique item key */
  items: Record<Item['key'], Item>
  /** Reusable item templates for common items */
  itemTemplates?: ItemTemplate[]
  /** Active storylines and plots */
  plots: Plot[]
  /** World lore and background information */
  lore: Lore[]

  // ===== World Metadata =====

  /** Current time in the game world (e.g., "1372年，夏末时节，傍晚") */
  currentGameTime: string
  /** Optional narrative outline for the world/story */
  outline?: string
}

/**
 * Event represents a significant occurrence in the world timeline
 * Events are used to track important story moments and their consequences
 */
export interface Event {
  /** Title of the event */
  title: string
  /** Category/type of event */
  type: string // e.g., 'story', 'combat', 'social', 'exploration', 'system'
  /** Game time when the event occurred */
  gameTime: string // e.g., "1372年，夏末时节，傍晚"
  /** Description of what happened */
  description: string
  /** IDs of characters involved in the event */
  participants: Character['id'][]
  /** Names of locations where the event took place */
  locations: Location['name'][]
  /** Consequences or outcomes of the event */
  consequences: string[]
  /** Importance level for filtering/event significance */
  importance: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Location represents a place in the game world
 * Locations can be connected to other locations and contain characters/items
 */
export interface Location {
  /** Unique name of the location */
  name: string
  /** Description of the location */
  description: string
  /** Names of locations that can be reached from here */
  connectedLocations: string[]
  /** Notable features or points of interest in this location */
  notableFeatures: string[]
  /** Names of characters currently present in this location */
  currentOccupants: string[]
  /** Secrets or hidden elements in this location */
  hiddenSecrets: string[]
  /** Keys of items currently present in this location */
  items: Item['key'][]
}

/**
 * Item represents a physical object in the game world
 * Items can be instances of templates or unique custom items
 *
 * Key Design Principle:
 * - Items are referenced by 'key' rather than 'id' to support stacking/quantity
 * - Template-based system allows for common items (e.g., multiple "Health Potion"s)
 */
export type Item = {
  /** Unique key identifying this specific item instance */
  key: string
  /** Optional quantity for stackable items */
  count?: number
  /** Reference to template for common items */
  templateName?: ItemTemplate['name']
} & Partial<ItemTemplate> // Properties specific to this item instance (overrides template)

/**
 * ItemTemplate defines reusable item types
 * Templates allow creation of multiple similar items with shared properties
 */
export interface ItemTemplate {
  /** Name of the item type */
  name: string
  /** Description of the item */
  description: string
  /** Category/classification of the item */
  type: 'weapon' | 'armor' | 'consumable' | 'tool' | 'key-item' | 'misc'
  /** Rarity level affecting availability/power */
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary'
  /** Default properties for all items of this type */
  properties: Record<string, string>
  /** Numerical stats for the item */
  stats: Record<string, number>
}

/**
 * Plot represents a storyline or quest in the world
 * Plots track narrative progression and player involvement
 */
export interface Plot {
  /** Title of the plot/quest */
  title: string
  /** Description of the plot */
  description: string
  /** Current status of the plot */
  status: 'active' | 'completed' | 'paused'
  /** IDs of characters involved in this plot */
  participants: Character['id'][]
  /** Key events that have occurred in this plot */
  keyEvents: string[]
  /** Next steps or objectives in the plot */
  nextSteps: string[]
  /** Importance level for prioritization */
  importance: 'main' | 'side' | 'personal'
}

/**
 * Lore represents background information and world-building details
 * Lore can be public knowledge, GM-only, or discovered by players
 */
export interface Lore {
  /** Title of the lore entry */
  title: string
  /** Content/details of the lore */
  content: string
  /** Access level controlling who can see this lore */
  accessLevel: 'public' | 'gm-only' | 'player-discovered'
}

/**
 * Character represents a person or creature in the game world
 * Characters can be player-controlled (PC) or non-player (NPC)
 */
export interface Character {
  /** Unique identifier for the character */
  id: string
  /** Name of the character */
  name: string
  /** Description of the character's appearance/personality */
  description: string
  /** Whether this is an NPC (true) or PC (false) */
  isNpc: boolean
  /** Optional avatar emoji or image URL */
  avatar?: string
}

/**
 * StatValue represents a numerical attribute with current/max values
 * Used for health, mana, and other measurable character attributes
 */
export type StatValue = {
  /** Current value of the stat */
  current: number
  /** Maximum possible value (optional for unlimited stats) */
  max?: number
}

/**
 * CharacterState tracks the dynamic state of a specific character
 * This includes their current location, inventory, stats, and knowledge
 *
 * Relationship:
 * - Each Character has one CharacterState per WorldState
 * - CharacterState is tied to a specific WorldState snapshot
 *
 * Database Storage:
 * CharacterStates are stored together with other complex data in the WorldState record
 */
export interface CharacterState {
  /** Name of the location where this character currently is */
  currentLocationName: string
  /** Keys of items in this character's inventory */
  inventory: Item['key'][]
  /** Character's numerical stats (health, mana, etc.) */
  stats: Record<string, StatValue>
  /** Character's attributes (strength, intelligence, etc.) */
  attributes: Record<string, number>
  /** Additional properties like skills, feats, etc. */
  properties: Record<string, string>
  /** Knowledge the character possesses (spells, languages, etc.) */
  knowledge: Record<string, string[]>
  /** Character's goals and objectives */
  goals: Record<string, string[]>
  /** Secrets the character knows or personal secrets */
  secrets: Record<string, string[]>
  /** Titles of lore entries this character has discovered */
  discoveredLores: Lore['title'][]
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
  type: 'character' | 'character-action' | 'system' | 'ai' | 'gm'
  /** Content/body of the message */
  content: string
  /** Timestamp when the message was created */
  createdAt: Date
  /** Timestamp when the message was last updated */
  updatedAt?: Date
  /** Display name of the character (cached for performance) */
  characterName?: string
}
