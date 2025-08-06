import { Router, Request, Response } from 'express'
import { DatabaseService } from '../services/database.interface'
import { WorldState } from '@weave/types'

export function createWorldStateRoutes(dbService: DatabaseService) {
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
      res.status(201).json(worldState)
    } catch (error) {
      console.error('Error creating world state:', error)
      res.status(500).json({ error: 'Failed to create world state' })
    }
  })

  // PUT /api/world-states/:id - Update world state
  router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const worldState = await dbService.updateWorldState(
        req.params.id,
        req.body
      )
      if (!worldState) {
        return res.status(404).json({ error: 'World state not found' })
      }
      res.json(worldState)
    } catch (error) {
      console.error('Error updating world state:', error)
      res.status(500).json({ error: 'Failed to update world state' })
    }
  })

  // DELETE /api/world-states/:id - Delete world state
  router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const deleted = await dbService.deleteWorldState(req.params.id)
      if (!deleted) {
        return res.status(404).json({ error: 'World state not found' })
      }
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting world state:', error)
      res.status(500).json({ error: 'Failed to delete world state' })
    }
  })

  return router
}
