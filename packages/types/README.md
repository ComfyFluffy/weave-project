# @weave/types

Shared TypeScript type definitions for the Weave platform.

## Overview

This package contains the core type definitions that are shared between the frontend and backend of the Weave platform. These types define the structure of all data entities in the system, including:

- Users and authentication
- Worlds and channels
- World state management (characters, locations, plots, events, items)
- Messaging system
- Game entities (characters, items, lore)

## Key Concepts

### World State Management

The heart of Weave's intelligent storytelling system is the `WorldState` entity, which maintains a structured representation of the game world. This includes:

- **Characters**: Both player characters (PCs) and non-player characters (NPCs)
- **Character States**: Dynamic state tracking for each character (inventory, stats, knowledge, etc.)
- **Locations**: Places in the world with connections and occupants
- **Items**: Physical objects with template-based instantiation
- **Plots**: Storylines and quests with progress tracking
- **Events**: Timeline of important occurrences
- **Lore**: World-building information with access controls

### Database Storage Strategy

To simplify database management for complex, flexible data structures, all complex `WorldState` data is stored as a single JSON object in the database rather than normalized tables. This approach provides several benefits:

1. **Flexibility**: Easy to evolve data structures without complex migrations
2. **Performance**: Single query to load entire world state
3. **Simplicity**: Reduced database complexity for nested, hierarchical data
4. **Type Safety**: Maintained at the application layer through TypeScript

Specifically, these fields in `WorldState` are stored together in a single `data` JSON field:
- `keyEventsLog` (Event[])
- `locations` (Location[])
- `plots` (Plot[])
- `lore` (Lore[])
- `characters` (Character[])
- `characterStates` (Record<Character['id'], CharacterState>)
- `items` (Record<Item['key'], Item>)
- `itemTemplates` (ItemTemplate[])

Only the core identifiers (`id`, `worldId`) and simple metadata (`currentGameTime`, `outline`) are stored as discrete database columns.

### Relationship Mapping

The types are designed with explicit relationships in mind:

```
World
├── Channels
└── WorldStates
    ├── Characters ─── CharacterStates
    ├── Locations
    ├── Items (with optional ItemTemplates)
    ├── Plots
    ├── Events
    └── Lore
```

Each `WorldState` represents a complete snapshot of the game world at a particular point in time, allowing for branching narratives and save states.

## Usage

These types are automatically available to all packages in the workspace through the `@weave/types` import alias.

```typescript
import type { WorldState, Character, Location } from '@weave/types'
```

## Development

When modifying types, ensure that changes are compatible with both frontend and backend usage, and that all related code is updated accordingly. Pay special attention to the JSON serialization implications for database storage.