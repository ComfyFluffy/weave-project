import { Router, Request, Response } from 'express'
import { DatabaseService } from '../services/database.interface'
import { WorldState, Character, Location, Plot, Event, Item } from '@weave/types'

export function createWorldStateRoutes(dbService: DatabaseService, emitWorldStateUpdate?: (worldStateId: string, worldState: any) => void) {
  const router = Router()

  // GET /api/world-states/:id - Get world state by ID
  router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }
      res.json(worldState)
    } catch (error) {
      console.error('Error fetching world state:', error)
      res.status(500).json({ error: 'Failed to fetch world state' })
    }
  })

  // GET /api/world-states/by-world/:worldId - Get world states by world ID
  router.get(
    '/by-world/:worldId',
    async (req: Request<{ worldId: string }>, res: Response) => {
      try {
        const worldStates = await dbService.getWorldStatesByWorldId(
          req.params.worldId
        )
        res.json(worldStates)
      } catch (error) {
        console.error('Error fetching world states:', error)
        res.status(500).json({ error: 'Failed to fetch world states' })
      }
    }
  )

  // GET /api/world-states/by-channel/:channelId - Get world state by channel ID
  router.get(
    '/by-channel/:channelId',
    async (req: Request<{ channelId: string }>, res: Response) => {
      try {
        const worldState = await dbService.getWorldStateByChannelId(
          req.params.channelId
        )
        if (!worldState) {
          return res.status(404).json({ error: 'World state not found' })
        }
        res.json(worldState)
      } catch (error) {
        console.error('Error fetching world state by channel:', error)
        res
          .status(500)
          .json({ error: 'Failed to fetch world state by channel' })
      }
    }
  )

  // POST /api/world-states - Create new world state
  router.post('/', async (req: Request, res: Response) => {
    try {
      const worldStateData: Omit<WorldState, 'id'> = req.body
      const worldState = await dbService.createWorldState(worldStateData)
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(worldState.id, worldState)
      }
      
      res.status(201).json(worldState)
    } catch (error) {
      console.error('Error creating world state:', error)
      res.status(500).json({ error: 'Failed to create world state' })
    }
  })

  // PUT /api/world-states/:id - Update world state (full replacement)
  router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const worldState = await dbService.updateWorldState(
        req.params.id,
        req.body
      )
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(worldState.id, worldState)
      }
      
      res.json(worldState)
    } catch (error) {
      console.error('Error updating world state:', error)
      res.status(500).json({ error: 'Failed to update world state' })
    }
  })

  // PATCH /api/world-states/:id - Partially update world state
  router.patch('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      // First get the current world state
      const currentWorldState = await dbService.getWorldStateById(req.params.id)
      if (!currentWorldState) {
        return res.status(404).json({ error: 'World state not found' })
      }

      // Merge the updates with the current state
      const updatedWorldState = { ...currentWorldState, ...req.body }
      
      // Update in database
      const worldState = await dbService.updateWorldState(
        req.params.id,
        updatedWorldState
      )
      
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(worldState.id, worldState)
      }
      
      res.json(worldState)
    } catch (error) {
      console.error('Error partially updating world state:', error)
      res.status(500).json({ error: 'Failed to partially update world state' })
    }
  })

  // DELETE /api/world-states/:id - Delete world state
  router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const deleted = await dbService.deleteWorldState(req.params.id)
      if (!deleted) {
        return res.status(404).json({ error: 'World state not found' })
      }
      
      // Emit world state deletion
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(req.params.id, null)
      }
      
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting world state:', error)
      res.status(500).json({ error: 'Failed to delete world state' })
    }
  })

  // ==================== Character Routes ====================
  
  // GET /api/world-states/:id/characters - Get all characters in world state
  router.get('/:id/characters', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }
      res.json(worldState.characters)
    } catch (error) {
      console.error('Error fetching characters:', error)
      res.status(500).json({ error: 'Failed to fetch characters' })
    }
  })

  // GET /api/world-states/:id/characters/:characterId - Get specific character
  router.get('/:id/characters/:characterId', async (req: Request<{ id: string, characterId: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }
      
      const character = worldState.characters.find(c => c.id === req.params.characterId)
      if (!character) {
        return res.status(404).json({ error: 'Character not found' })
      }
      
      res.json(character)
    } catch (error) {
      console.error('Error fetching character:', error)
      res.status(500).json({ error: 'Failed to fetch character' })
    }
  })

  // POST /api/world-states/:id/characters - Add new character
  router.post('/:id/characters', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }

      // Add character to world state
      const newCharacter: Character = {
        id: `char-${Date.now()}`, // Simple ID generation for now
        ...req.body
      }
      
      const updatedWorldState = {
        ...worldState,
        characters: [...worldState.characters, newCharacter]
      }
      
      const result = await dbService.updateWorldState(req.params.id, updatedWorldState)
      if (!result) {
        return res.status(500).json({ error: 'Failed to update world state' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(result.id, result)
      }
      
      res.status(201).json(newCharacter)
    } catch (error) {
      console.error('Error adding character:', error)
      res.status(500).json({ error: 'Failed to add character' })
    }
  })

  // PUT /api/world-states/:id/characters/:characterId - Update character
  router.put('/:id/characters/:characterId', async (req: Request<{ id: string, characterId: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }

      // Find and update character
      const characterIndex = worldState.characters.findIndex(c => c.id === req.params.characterId)
      if (characterIndex === -1) {
        return res.status(404).json({ error: 'Character not found' })
      }

      const updatedCharacter = { ...worldState.characters[characterIndex], ...req.body }
      const updatedCharacters = [...worldState.characters]
      updatedCharacters[characterIndex] = updatedCharacter
      
      const updatedWorldState = {
        ...worldState,
        characters: updatedCharacters
      }
      
      const result = await dbService.updateWorldState(req.params.id, updatedWorldState)
      if (!result) {
        return res.status(500).json({ error: 'Failed to update world state' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(result.id, result)
      }
      
      res.json(updatedCharacter)
    } catch (error) {
      console.error('Error updating character:', error)
      res.status(500).json({ error: 'Failed to update character' })
    }
  })

  // DELETE /api/world-states/:id/characters/:characterId - Delete character
  router.delete('/:id/characters/:characterId', async (req: Request<{ id: string, characterId: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }

      // Check if character exists
      const characterIndex = worldState.characters.findIndex(c => c.id === req.params.characterId)
      if (characterIndex === -1) {
        return res.status(404).json({ error: 'Character not found' })
      }

      // Remove character
      const updatedCharacters = worldState.characters.filter(c => c.id !== req.params.characterId)
      const updatedWorldState = {
        ...worldState,
        characters: updatedCharacters
      }
      
      const result = await dbService.updateWorldState(req.params.id, updatedWorldState)
      if (!result) {
        return res.status(500).json({ error: 'Failed to update world state' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(result.id, result)
      }
      
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting character:', error)
      res.status(500).json({ error: 'Failed to delete character' })
    }
  })

  // ==================== Location Routes ====================
  
  // GET /api/world-states/:id/locations - Get all locations in world state
  router.get('/:id/locations', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }
      res.json(worldState.locations)
    } catch (error) {
      console.error('Error fetching locations:', error)
      res.status(500).json({ error: 'Failed to fetch locations' })
    }
  })

  // POST /api/world-states/:id/locations - Add new location
  router.post('/:id/locations', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }

      // Add location to world state
      const newLocation: Location = req.body
      
      const updatedWorldState = {
        ...worldState,
        locations: [...worldState.locations, newLocation]
      }
      
      const result = await dbService.updateWorldState(req.params.id, updatedWorldState)
      if (!result) {
        return res.status(500).json({ error: 'Failed to update world state' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(result.id, result)
      }
      
      res.status(201).json(newLocation)
    } catch (error) {
      console.error('Error adding location:', error)
      res.status(500).json({ error: 'Failed to add location' })
    }
  })

  // PUT /api/world-states/:id/locations/:locationName - Update location
  router.put('/:id/locations/:locationName', async (req: Request<{ id: string, locationName: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }

      // Find and update location
      const locationIndex = worldState.locations.findIndex(l => l.name === req.params.locationName)
      if (locationIndex === -1) {
        return res.status(404).json({ error: 'Location not found' })
      }

      const updatedLocation = { ...worldState.locations[locationIndex], ...req.body }
      const updatedLocations = [...worldState.locations]
      updatedLocations[locationIndex] = updatedLocation
      
      const updatedWorldState = {
        ...worldState,
        locations: updatedLocations
      }
      
      const result = await dbService.updateWorldState(req.params.id, updatedWorldState)
      if (!result) {
        return res.status(500).json({ error: 'Failed to update world state' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(result.id, result)
      }
      
      res.json(updatedLocation)
    } catch (error) {
      console.error('Error updating location:', error)
      res.status(500).json({ error: 'Failed to update location' })
    }
  })

  // DELETE /api/world-states/:id/locations/:locationName - Delete location
  router.delete('/:id/locations/:locationName', async (req: Request<{ id: string, locationName: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }

      // Check if location exists
      const locationIndex = worldState.locations.findIndex(l => l.name === req.params.locationName)
      if (locationIndex === -1) {
        return res.status(404).json({ error: 'Location not found' })
      }

      // Remove location
      const updatedLocations = worldState.locations.filter(l => l.name !== req.params.locationName)
      const updatedWorldState = {
        ...worldState,
        locations: updatedLocations
      }
      
      const result = await dbService.updateWorldState(req.params.id, updatedWorldState)
      if (!result) {
        return res.status(500).json({ error: 'Failed to update world state' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(result.id, result)
      }
      
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting location:', error)
      res.status(500).json({ error: 'Failed to delete location' })
    }
  })

  // ==================== Plot Routes ====================
  
  // GET /api/world-states/:id/plots - Get all plots in world state
  router.get('/:id/plots', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }
      res.json(worldState.plots)
    } catch (error) {
      console.error('Error fetching plots:', error)
      res.status(500).json({ error: 'Failed to fetch plots' })
    }
  })

  // POST /api/world-states/:id/plots - Add new plot
  router.post('/:id/plots', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }

      // Add plot to world state
      const newPlot: Plot = req.body
      
      const updatedWorldState = {
        ...worldState,
        plots: [...worldState.plots, newPlot]
      }
      
      const result = await dbService.updateWorldState(req.params.id, updatedWorldState)
      if (!result) {
        return res.status(500).json({ error: 'Failed to update world state' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(result.id, result)
      }
      
      res.status(201).json(newPlot)
    } catch (error) {
      console.error('Error adding plot:', error)
      res.status(500).json({ error: 'Failed to add plot' })
    }
  })

  // PUT /api/world-states/:id/plots/:plotTitle - Update plot
  router.put('/:id/plots/:plotTitle', async (req: Request<{ id: string, plotTitle: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }

      // Find and update plot
      const plotIndex = worldState.plots.findIndex(p => p.title === req.params.plotTitle)
      if (plotIndex === -1) {
        return res.status(404).json({ error: 'Plot not found' })
      }

      const updatedPlot = { ...worldState.plots[plotIndex], ...req.body }
      const updatedPlots = [...worldState.plots]
      updatedPlots[plotIndex] = updatedPlot
      
      const updatedWorldState = {
        ...worldState,
        plots: updatedPlots
      }
      
      const result = await dbService.updateWorldState(req.params.id, updatedWorldState)
      if (!result) {
        return res.status(500).json({ error: 'Failed to update world state' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(result.id, result)
      }
      
      res.json(updatedPlot)
    } catch (error) {
      console.error('Error updating plot:', error)
      res.status(500).json({ error: 'Failed to update plot' })
    }
  })

  // DELETE /api/world-states/:id/plots/:plotTitle - Delete plot
  router.delete('/:id/plots/:plotTitle', async (req: Request<{ id: string, plotTitle: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }

      // Check if plot exists
      const plotIndex = worldState.plots.findIndex(p => p.title === req.params.plotTitle)
      if (plotIndex === -1) {
        return res.status(404).json({ error: 'Plot not found' })
      }

      // Remove plot
      const updatedPlots = worldState.plots.filter(p => p.title !== req.params.plotTitle)
      const updatedWorldState = {
        ...worldState,
        plots: updatedPlots
      }
      
      const result = await dbService.updateWorldState(req.params.id, updatedWorldState)
      if (!result) {
        return res.status(500).json({ error: 'Failed to update world state' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(result.id, result)
      }
      
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting plot:', error)
      res.status(500).json({ error: 'Failed to delete plot' })
    }
  })

  // ==================== Event Routes ====================
  
  // GET /api/world-states/:id/events - Get all events in world state
  router.get('/:id/events', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }
      res.json(worldState.keyEventsLog)
    } catch (error) {
      console.error('Error fetching events:', error)
      res.status(500).json({ error: 'Failed to fetch events' })
    }
  })

  // POST /api/world-states/:id/events - Add new event
  router.post('/:id/events', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const worldState = await dbService.getWorldStateById(req.params.id)
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }

      // Add event to world state
      const newEvent: Event = {
        ...req.body,
        gameTime: req.body.gameTime || new Date().toISOString() // Add timestamp if not provided
      }
      
      const updatedWorldState = {
        ...worldState,
        keyEventsLog: [...worldState.keyEventsLog, newEvent]
      }
      
      const result = await dbService.updateWorldState(req.params.id, updatedWorldState)
      if (!result) {
        return res.status(500).json({ error: 'Failed to update world state' })
      }
      
      // Emit world state update
      if (emitWorldStateUpdate) {
        emitWorldStateUpdate(result.id, result)
      }
      
      res.status(201).json(newEvent)
    } catch (error) {
      console.error('Error adding event:', error)
      res.status(500).json({ error: 'Failed to add event' })
    }
  })

  return router
}
