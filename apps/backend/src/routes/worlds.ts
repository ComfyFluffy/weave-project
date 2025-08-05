import { Router, Request, Response } from 'express'
import { DatabaseService } from '../services/database.interface'
import { World } from '@weave/types'

export function createWorldRoutes(dbService: DatabaseService) {
  const router = Router()

  // GET /api/worlds - Get all worlds
  router.get('/', async (req: Request, res: Response) => {
    try {
      const worlds = await dbService.getWorlds()
      res.json(worlds)
    } catch (error) {
      console.error('Error fetching worlds:', error)
      res.status(500).json({ error: 'Failed to fetch worlds' })
    }
  })

  // GET /api/worlds/:id - Get world by ID
  router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const world = await dbService.getWorldById(req.params.id)
      if (!world) {
        return res.status(404).json({ error: 'World not found' })
      }
      res.json(world)
    } catch (error) {
      console.error('Error fetching world:', error)
      res.status(500).json({ error: 'Failed to fetch world' })
    }
  })

  // POST /api/worlds - Create new world
  router.post('/', async (req: Request, res: Response) => {
    try {
      const worldData: Omit<World, 'id'> = req.body
      const world = await dbService.createWorld(worldData)
      res.status(201).json(world)
    } catch (error) {
      console.error('Error creating world:', error)
      res.status(500).json({ error: 'Failed to create world' })
    }
  })

  // PUT /api/worlds/:id - Update world
  router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const world = await dbService.updateWorld(req.params.id, req.body)
      if (!world) {
        return res.status(404).json({ error: 'World not found' })
      }
      res.json(world)
    } catch (error) {
      console.error('Error updating world:', error)
      res.status(500).json({ error: 'Failed to update world' })
    }
  })

  // DELETE /api/worlds/:id - Delete world
  router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const deleted = await dbService.deleteWorld(req.params.id)
      if (!deleted) {
        return res.status(404).json({ error: 'World not found' })
      }
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting world:', error)
      res.status(500).json({ error: 'Failed to delete world' })
    }
  })

  // GET /api/worlds/:id/channels/:channelId - Get channel by ID
  router.get(
    '/:id/channels/:channelId',
    async (req: Request<{ id: string; channelId: string }>, res: Response) => {
      try {
        const result = await dbService.getChannelById(req.params.channelId)
        if (!result) {
          return res.status(404).json({ error: 'Channel not found' })
        }
        res.json(result)
      } catch (error) {
        console.error('Error fetching channel:', error)
        res.status(500).json({ error: 'Failed to fetch channel' })
      }
    }
  )

  return router
}
