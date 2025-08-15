import type { WorldState, Character, Location, Plot } from '@weave/types'
import { apiService } from './apiService'

class WorldStateService {
  // World State endpoints (delegating to apiService)
  async fetchWorldState(worldStateId: string): Promise<WorldState> {
    return apiService.fetchWorldState(worldStateId)
  }

  async fetchWorldStatesByWorldId(worldId: string): Promise<WorldState[]> {
    return apiService.fetchWorldStatesByWorldId(worldId)
  }

  async createWorldState(
    worldStateData: Omit<WorldState, 'id'>
  ): Promise<WorldState> {
    return apiService.createWorldState(worldStateData)
  }

  async updateWorldState(
    worldStateId: string,
    data: Partial<WorldState>
  ): Promise<WorldState> {
    return apiService.updateWorldState(worldStateId, data)
  }

  // Character endpoints
  async fetchCharacters(worldStateId: string): Promise<Character[]> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/characters`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch characters')
    }
    return response.json()
  }

  async fetchCharacter(
    worldStateId: string,
    characterId: string
  ): Promise<Character> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/characters/${characterId}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch character')
    }
    return response.json()
  }

  async createCharacter(
    worldStateId: string,
    characterData: Omit<Character, 'id'>
  ): Promise<Character> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/characters`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characterData),
      }
    )
    if (!response.ok) throw new Error('Failed to create character')
    return response.json()
  }

  async updateCharacter(
    worldStateId: string,
    characterId: string,
    data: Partial<Character>
  ): Promise<Character> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/characters/${characterId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    if (!response.ok) throw new Error('Failed to update character')
    return response.json()
  }

  async deleteCharacter(
    worldStateId: string,
    characterId: string
  ): Promise<void> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/characters/${characterId}`,
      {
        method: 'DELETE',
      }
    )
    if (!response.ok) throw new Error('Failed to delete character')
  }

  // Location endpoints
  async fetchLocations(worldStateId: string): Promise<Location[]> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/locations`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch locations')
    }
    return response.json()
  }

  async createLocation(
    worldStateId: string,
    locationData: Location
  ): Promise<Location> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/locations`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
      }
    )
    if (!response.ok) throw new Error('Failed to create location')
    return response.json()
  }

  async updateLocation(
    worldStateId: string,
    locationName: string,
    data: Partial<Location>
  ): Promise<Location> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/locations/${encodeURIComponent(
        locationName
      )}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    if (!response.ok) throw new Error('Failed to update location')
    return response.json()
  }

  async deleteLocation(
    worldStateId: string,
    locationName: string
  ): Promise<void> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/locations/${encodeURIComponent(
        locationName
      )}`,
      {
        method: 'DELETE',
      }
    )
    if (!response.ok) throw new Error('Failed to delete location')
  }

  // Plot endpoints
  async fetchPlots(worldStateId: string): Promise<Plot[]> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/plots`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch plots')
    }
    return response.json()
  }

  async createPlot(worldStateId: string, plotData: Plot): Promise<Plot> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/plots`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plotData),
      }
    )
    if (!response.ok) throw new Error('Failed to create plot')
    return response.json()
  }

  async updatePlot(
    worldStateId: string,
    plotTitle: string,
    data: Partial<Plot>
  ): Promise<Plot> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/plots/${encodeURIComponent(
        plotTitle
      )}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    if (!response.ok) throw new Error('Failed to update plot')
    return response.json()
  }

  async deletePlot(worldStateId: string, plotTitle: string): Promise<void> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/plots/${encodeURIComponent(
        plotTitle
      )}`,
      {
        method: 'DELETE',
      }
    )
    if (!response.ok) throw new Error('Failed to delete plot')
  }

  // Event endpoints
  async fetchEvents(worldStateId: string): Promise<any[]> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/events`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }
    return response.json()
  }

  async createEvent(worldStateId: string, eventData: any): Promise<any> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      }
    )
    if (!response.ok) throw new Error('Failed to create event')
    return response.json()
  }

  // Helper method for updating world state with common pattern
  private async updateWorldStateWithChanges(
    worldStateId: string,
    updateFn: (worldState: WorldState) => void
  ): Promise<WorldState> {
    // Fetch the current world state
    const worldState = await this.fetchWorldState(worldStateId)

    // Apply the update function
    updateFn(worldState)

    // Update the world state
    return this.updateWorldState(worldStateId, worldState)
  }

  // Character Stats endpoints
  async updateCharacterStat(
    worldStateId: string,
    characterId: string,
    statName: string,
    newValue: number
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      if (worldState.state.characterStates?.[characterId]) {
        if (!worldState.state.characterStates[characterId].stats) {
          worldState.state.characterStates[characterId].stats = {}
        }
        if (!worldState.state.characterStates[characterId].stats[statName]) {
          worldState.state.characterStates[characterId].stats[statName] = {
            current: 0,
          }
        }
        worldState.state.characterStates[characterId].stats[statName].current =
          newValue
      }
    })
  }

  // World state metadata endpoints
  async updateWorldStateMetadata(
    worldStateId: string,
    metadata: { currentGameTime?: string; outline?: string }
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      if (metadata.currentGameTime !== undefined) {
        worldState.state.currentGameTime = metadata.currentGameTime
      }

      if (metadata.outline !== undefined) {
        worldState.state.outline = metadata.outline
      }
    })
  }

  // World state numeric fields endpoints
  async updateWorldStateNumericFields(
    worldStateId: string,
    updates: {
      characterCount?: number
      locationCount?: number
      activePlotCount?: number
      importantEventCount?: number
    }
  ): Promise<WorldState> {
    // For now, we'll just return the world state as-is since these are computed values
    // In a real implementation, these would be stored fields that we update
    console.warn('updateWorldStateNumericFields called with:', updates)

    // Fetch and return the current world state
    return this.fetchWorldState(worldStateId)
  }

  async updateLocationDetails(
    worldStateId: string,
    locationName: string,
    updates: Partial<Location>
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      const locationIndex = worldState.state.locations.findIndex(
        (loc) => loc.name === locationName
      )
      if (locationIndex !== -1) {
        worldState.state.locations[locationIndex] = {
          ...worldState.state.locations[locationIndex],
          ...updates,
        }
      }
    })
  }

  // Location numeric fields endpoints
  async updateLocationNumericFields(
    worldStateId: string,
    locationName: string,
    updates: {
      currentOccupantCount?: number
    }
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      const locationIndex = worldState.state.locations.findIndex(
        (loc) => loc.name === locationName
      )
      if (locationIndex !== -1) {
        // Update current occupant count (this is a simplification - in a real app, we'd manage the actual occupants array)
        if (updates.currentOccupantCount !== undefined) {
          // Create a dummy occupants array with the specified count
          worldState.state.locations[locationIndex].currentOccupants =
            Array.from(
              { length: updates.currentOccupantCount },
              (_, i) => `人员 ${i + 1}`
            )
        }
      }
    })
  }

  async updatePlotDetails(
    worldStateId: string,
    plotTitle: string,
    updates: Partial<Plot>
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      const plotIndex = worldState.state.plots.findIndex(
        (plot) => plot.title === plotTitle
      )
      if (plotIndex !== -1) {
        worldState.state.plots[plotIndex] = {
          ...worldState.state.plots[plotIndex],
          ...updates,
        }
      }
    })
  }

  // Plot count endpoints
  async updatePlotCounts(
    worldStateId: string,
    updates: {
      activeCount?: number
      completedCount?: number
      pausedCount?: number
    }
  ): Promise<WorldState> {
    // This is a simplification - in a real app, we'd actually update the plots
    // For now, we'll just log the updates
    console.warn('updatePlotCounts called with:', updates)

    // Fetch and return the current world state
    return this.fetchWorldState(worldStateId)
  }

  // Character info endpoints
  async updateCharacterInfo(
    worldStateId: string,
    characterId: string,
    updates: Partial<Character>
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      const characterIndex = worldState.characters.findIndex(
        (char) => char.id === characterId
      )
      if (characterIndex !== -1) {
        worldState.characters[characterIndex] = {
          ...worldState.characters[characterIndex],
          ...updates,
        }
      }
    })
  }

  // Character numeric fields endpoints
  async updateCharacterNumericFields(
    worldStateId: string,
    characterId: string,
    updates: {
      currentLocation?: string
      inventoryCount?: number
      discoveredLoresCount?: number
    }
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      if (worldState.state.characterStates?.[characterId]) {
        const characterState = worldState.state.characterStates[characterId]

        // Update current location
        if (updates.currentLocation !== undefined) {
          characterState.currentLocationName = updates.currentLocation
        }

        // Update inventory count (this is a simplification - in a real app, we'd manage the actual inventory array)
        if (updates.inventoryCount !== undefined) {
          // Create a dummy inventory array with the specified count
          characterState.inventory = Array.from(
            { length: updates.inventoryCount },
            (_, i) => `物品 ${i + 1}`
          )
        }

        // Update discovered lores count (this is a simplification - in a real app, we'd manage the actual lores array)
        if (updates.discoveredLoresCount !== undefined) {
          // Create a dummy lores array with the specified count
          characterState.discoveredLores = Array.from(
            { length: updates.discoveredLoresCount },
            (_, i) => `传说 ${i + 1}`
          )
        }
      }
    })
  }

  // Character properties, knowledge, goals, and secrets endpoints
  async updateCharacterPropertiesAndKnowledge(
    worldStateId: string,
    characterId: string,
    updates: {
      properties?: Record<string, string>
      knowledge?: Record<string, string[]>
      goals?: Record<string, string[]>
      secrets?: Record<string, string[]>
    }
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      if (worldState.state.characterStates?.[characterId]) {
        const characterState = worldState.state.characterStates[characterId]

        // Update properties
        if (updates.properties !== undefined) {
          characterState.properties = {
            ...characterState.properties,
            ...updates.properties,
          }
        }

        // Update knowledge
        if (updates.knowledge !== undefined) {
          characterState.knowledge = {
            ...characterState.knowledge,
            ...updates.knowledge,
          }
        }

        // Update goals
        if (updates.goals !== undefined) {
          characterState.goals = {
            ...characterState.goals,
            ...updates.goals,
          }
        }

        // Update secrets
        if (updates.secrets !== undefined) {
          characterState.secrets = {
            ...characterState.secrets,
            ...updates.secrets,
          }
        }
      }
    })
  }

  // Item endpoints
  async updateItemName(
    worldStateId: string,
    itemKey: string,
    newName: string
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      if (worldState.state.items?.[itemKey]) {
        // Update the item's name
        const updatedItem = {
          ...worldState.state.items[itemKey],
          name: newName,
        }

        // Update the item in the world state
        worldState.state.items = {
          ...worldState.state.items,
          [itemKey]: updatedItem,
        }
      }
    })
  }

  // Update item property (description, type, rarity, properties, stats)
  async updateItemProperty(
    worldStateId: string,
    itemKey: string,
    property: string,
    newValue: any
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      if (worldState.state.items?.[itemKey]) {
        // Update the item's property
        const updatedItem = {
          ...worldState.state.items[itemKey],
          [property]: newValue,
        }

        // Update the item in the world state
        worldState.state.items = {
          ...worldState.state.items,
          [itemKey]: updatedItem,
        }
      }
    })
  }

  // Add item to character's inventory
  async addItemToCharacterInventory(
    worldStateId: string,
    characterId: string,
    item: any
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      // Add the item to the world state items collection
      if (!worldState.state.items) {
        worldState.state.items = {}
      }

      worldState.state.items = {
        ...worldState.state.items,
        [item.key]: item,
      }

      // Add the item to the character's inventory
      if (worldState.state.characterStates?.[characterId]) {
        const characterState = worldState.state.characterStates[characterId]
        if (!characterState.inventory) {
          characterState.inventory = []
        }
        characterState.inventory = [...characterState.inventory, item.key]
      }
    })
  }

  // Remove item from character's inventory
  async removeItemFromCharacterInventory(
    worldStateId: string,
    characterId: string,
    itemKey: string
  ): Promise<WorldState> {
    return this.updateWorldStateWithChanges(worldStateId, (worldState) => {
      // Remove the item from the character's inventory
      if (worldState.state.characterStates?.[characterId]) {
        const characterState = worldState.state.characterStates[characterId]
        if (characterState.inventory) {
          characterState.inventory = characterState.inventory.filter(
            (key) => key !== itemKey
          )
        }
      }
    })
  }
}

export const worldStateService = new WorldStateService()
