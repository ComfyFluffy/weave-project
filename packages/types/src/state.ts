import type { Character, Id, World } from '.'

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

  /** All characters in this world */
  characters: Character[]

  state: {
    // ===== Core Entity Collections (Stored together in single JSON field) =====

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
