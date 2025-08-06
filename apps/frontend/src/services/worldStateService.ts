import type { WorldState, Character, Location, Plot, Event } from '@weave/types'
import { apiService } from './apiService'

class WorldStateService {
  // World State endpoints
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
  async fetchEvents(worldStateId: string): Promise<Event[]> {
    const response = await fetch(
      `http://localhost:3001/api/world-states/${worldStateId}/events`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }
    return response.json()
  }

  async createEvent(
    worldStateId: string,
    eventData: Omit<Event, 'gameTime'>
  ): Promise<Event> {
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
}

export const worldStateService = new WorldStateService()
