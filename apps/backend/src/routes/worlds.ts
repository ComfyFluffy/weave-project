import { Router, Request, Response } from 'express'
import { DatabaseService } from '../services/database.interface'
import { World } from '@weave/types'
import {
  WorldIdRequestParamSchema,
  WorldCreateRequestSchema,
} from '@weave/types/apis'
import { initServer } from '@ts-rest/express'
import { worldContract } from '../../../../packages/types/src/apis/contracts/world'

export function createWorldRoutes(dbService: DatabaseService) {
  const router = Router()

  // GET /api/worlds - Get all worlds
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const worlds = await dbService.getWorlds()
      res.superjson(worlds)
    } catch (error) {
      console.error('Error fetching worlds:', error)
      res.superjson({ error: 'Failed to fetch worlds' }, 500)
    }
  })

  // GET /api/worlds/:id - Get world by ID
  router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const parsed = WorldIdRequestParamSchema.safeParse(req.params)
      if (!parsed.success) {
        return res.superjson({ error: 'Invalid world id' }, 400)
      }
      const world = await dbService.getWorldById(req.params.id)
      if (!world) {
        return res.superjson({ error: 'World not found' }, 404)
      }
      res.superjson(world)
    } catch (error) {
      console.error('Error fetching world:', error)
      res.superjson({ error: 'Failed to fetch world' }, 500)
    }
  })

  // POST /api/worlds - Create new world
  router.post('/', async (req: Request, res: Response) => {
    try {
      const parsed = WorldCreateRequestSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.superjson({ error: 'Invalid world body' }, 400)
      }
      const worldData: Omit<World, 'id'> = parsed.data
      const world = await dbService.createWorld(worldData)
      res.superjson(world, 201)
    } catch (error) {
      console.error('Error creating world:', error)
      res.superjson({ error: 'Failed to create world' }, 500)
    }
  })

  // PUT /api/worlds/:id - Update world
  router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const idParsed = WorldIdRequestParamSchema.safeParse(req.params)
      if (!idParsed.success) {
        return res.superjson({ error: 'Invalid world id' }, 400)
      }
      // allow partial updates for now, validate known fields only
      const partialWorld = WorldCreateRequestSchema.partial()
      const bodyParsed = partialWorld.safeParse(req.body)
      if (!bodyParsed.success) {
        return res.superjson({ error: 'Invalid world body' }, 400)
      }
      const world = await dbService.updateWorld(req.params.id, bodyParsed.data)
      if (!world) {
        return res.superjson({ error: 'World not found' }, 404)
      }
      res.superjson(world)
    } catch (error) {
      console.error('Error updating world:', error)
      res.superjson({ error: 'Failed to update world' }, 500)
    }
  })

  // DELETE /api/worlds/:id - Delete world
  router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const parsed = WorldIdRequestParamSchema.safeParse(req.params)
      if (!parsed.success) {
        return res.superjson({ error: 'Invalid world id' }, 400)
      }
      const deleted = await dbService.deleteWorld(req.params.id)
      if (!deleted) {
        return res.superjson({ error: 'World not found' }, 404)
      }
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting world:', error)
      res.superjson({ error: 'Failed to delete world' }, 500)
    }
  })

  // GET /api/worlds/:id/channels/:channelId - Get channel by ID
  router.get(
    '/:id/channels/:channelId',
    async (req: Request<{ id: string; channelId: string }>, res: Response) => {
      try {
        const result = await dbService.getChannelById(req.params.channelId)
        if (!result) {
          return res.superjson({ error: 'Channel not found' }, 404)
        }
        res.superjson(result)
      } catch (error) {
        console.error('Error fetching channel:', error)
        res.superjson({ error: 'Failed to fetch channel' }, 500)
      }
    }
  )

  return router
}

export function createWorldRouter(dbService: DatabaseService) {
  const s = initServer()
  return s.router(worldContract, {
    getWorlds: async () => {
      try {
        const worlds = await dbService.getWorlds()
        return {
          status: 200,
          body: {
            worlds: worlds,
          },
        }
      } catch (error) {
        console.error('Error fetching worlds:', error)
        return {
          status: 500,
          body: {
            message: 'Failed to fetch worlds',
          },
        }
      }
    },
    getWorldById: async ({ params }) => {
      const world = await dbService.getWorldById(params.id)
      if (!world) {
        return {
          status: 400,
          body: {
            message: 'World not found!',
          },
        }
      }
      return {
        status: 200,
        body: {
          world: world,
        },
      }
    },
  })
}
