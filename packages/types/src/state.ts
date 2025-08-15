import z from 'zod'
import { CharacterSchema } from './character'

/**
 * Location represents a place in the game world
 * Locations can be connected to other locations and contain characters/items
 */
export const LocationSchema = z.object({
  /** Unique name of the location */
  name: z.string(),
  /** Description of the location */
  description: z.string(),
  /** Names of locations that can be reached from here */
  connectedLocations: z.array(z.string()),
  /** Notable features or points of interest in this location */
  notableFeatures: z.array(z.string()),
  /** Names of characters currently present in this location */
  currentOccupants: z.array(z.string()),
  /** Secrets or hidden elements in this location */
  hiddenSecrets: z.array(z.string()),
  /** Keys of items currently present in this location */
  items: z.array(z.string()),
})
export type Location = z.infer<typeof LocationSchema>

/**
 * Event represents a significant occurrence in the world timeline
 * Events are used to track important story moments and their consequences
 */
export const EventSchema = z.object({
  /** Title of the event */
  title: z.string(),
  /** Category/type of event */
  type: z.string(), // e.g., 'story', 'combat', 'social', 'exploration', 'system'
  /** Game time when the event occurred */
  gameTime: z.string(), // e.g., "1372年，夏末时节，傍晚"
  /** Description of what happened */
  description: z.string(),
  /** IDs of characters involved in the event */
  participants: z.array(z.string()),
  /** Names of locations where the event took place */
  locations: z.array(z.string()),
  /** Consequences or outcomes of the event */
  consequences: z.array(z.string()),
  /** Importance level for filtering/event significance */
  importance: z.enum(['low', 'medium', 'high', 'critical']),
})
export type Event = z.infer<typeof EventSchema>

/**
 * ItemTemplate defines reusable item types
 * Templates allow creation of multiple similar items with shared properties
 */
export const ItemTemplateSchema = z.object({
  /** Name of the item type */
  name: z.string(),
  /** Description of the item */
  description: z.string(),
  /** Category/classification of the item */
  type: z.enum(['weapon', 'armor', 'consumable', 'tool', 'key-item', 'misc']),
  /** Rarity level affecting availability/power */
  rarity: z.enum(['common', 'uncommon', 'rare', 'very-rare', 'legendary']),
  /** Default properties for all items of this type */
  properties: z.record(z.string()),
  /** Numerical stats for the item */
  stats: z.record(z.number()),
})
export type ItemTemplate = z.infer<typeof ItemTemplateSchema>

/**
 * Item represents a physical object in the game world
 * Items can be instances of templates or unique custom items
 *
 * Key Design Principle:
 * - Items are referenced by 'key' rather than 'id' to support stacking/quantity
 * - Template-based system allows for common items (e.g., multiple "Health Potion"s)
 */
export const ItemSchema = z
  .object({
    /** Unique key identifying this specific item instance */
    key: z.string(),
    /** Optional quantity for stackable items */
    count: z.number().optional(),
    /** Reference to template for common items */
    templateName: z.string().optional(),
  })
  .and(ItemTemplateSchema.partial()) // Properties specific to this item instance (overrides template)
export type Item = z.infer<typeof ItemSchema>

/**
 * Plot represents a storyline or quest in the world
 * Plots track narrative progression and player involvement
 */
export const PlotSchema = z.object({
  /** Title of the plot/quest */
  title: z.string(),
  /** Description of the plot */
  description: z.string(),
  /** Current status of the plot */
  status: z.enum(['active', 'completed', 'paused']),
  /** IDs of characters involved in this plot */
  participants: z.array(z.string()),
  /** Key events that have occurred in this plot */
  keyEvents: z.array(z.string()),
  /** Next steps or objectives in the plot */
  nextSteps: z.array(z.string()),
  /** Importance level for prioritization */
  importance: z.enum(['main', 'side', 'personal']),
})
export type Plot = z.infer<typeof PlotSchema>

/**
 * Lore represents background information and world-building details
 * Lore can be public knowledge, GM-only, or discovered by players
 */
export const LoreSchema = z.object({
  /** Title of the lore entry */
  title: z.string(),
  /** Content/details of the lore */
  content: z.string(),
  /** Access level controlling who can see this lore */
  accessLevel: z.enum(['public', 'gm-only', 'player-discovered']),
})
export type Lore = z.infer<typeof LoreSchema>

/**
 * StatValue represents a numerical attribute with current/max values
 * Used for health, mana, and other measurable character attributes
 */
export const StatValueSchema = z.object({
  /** Current value of the stat */
  current: z.number(),
  /** Maximum possible value (optional for unlimited stats) */
  max: z.number().optional(),
})
export type StatValue = z.infer<typeof StatValueSchema>

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
export const CharacterStateSchema = z.object({
  /** Name of the location where this character currently is */
  currentLocationName: z.string(),
  /** Keys of items in this character's inventory */
  inventory: z.array(z.string()),
  /** Character's numerical stats (health, mana, etc.) */
  stats: z.record(StatValueSchema),
  /** Character's attributes (strength, intelligence, etc.) */
  attributes: z.record(z.number()),
  /** Additional properties like skills, feats, etc. */
  properties: z.record(z.string()),
  /** Knowledge the character possesses (spells, languages, etc.) */
  knowledge: z.record(z.array(z.string())),
  /** Character's goals and objectives */
  goals: z.record(z.array(z.string())),
  /** Secrets the character knows or personal secrets */
  secrets: z.record(z.array(z.string())),
  /** Titles of lore entries this character has discovered */
  discoveredLores: z.array(z.string()),
})
export type CharacterState = z.infer<typeof CharacterStateSchema>

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
export const WorldStateSchema = z.object({
  /** Unique identifier for the world state */
  id: z.string(),
  /** ID of the world this state belongs to */
  worldId: z.string(),

  /** All characters in this world */
  characters: z.array(CharacterSchema),

  state: z.object({
    // ===== Core Entity Collections (Stored together in single JSON field) =====

    /** Timeline of important events in the world */
    keyEventsLog: z.array(EventSchema),
    /** Detailed state information for each character */
    characterStates: z.record(CharacterStateSchema),
    /** All locations in the world */
    locations: z.array(LocationSchema),
    /** All items in the world, keyed by unique item key */
    items: z.record(ItemSchema),
    /** Reusable item templates for common items */
    itemTemplates: z.array(ItemTemplateSchema).optional(),
    /** Active storylines and plots */
    plots: z.array(PlotSchema),
    /** World lore and background information */
    lore: z.array(LoreSchema),

    // ===== World Metadata =====

    /** Current time in the game world (e.g., "1372年，夏末时节，傍晚") */
    currentGameTime: z.string(),
    /** Optional narrative outline for the world/story */
    outline: z.string().optional(),
  }),
})
export type WorldState = z.infer<typeof WorldStateSchema>
