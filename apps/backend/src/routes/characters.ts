import { Router, Request, Response } from 'express'
import { DatabaseService } from '../services/database.interface'
import { Character } from '@weave/types'

export function createCharacterRoutes(dbService: DatabaseService) {
  const router = Router()

  // GET /api/characters/by-world/:worldId - Get characters by world ID
  router.get(
    '/by-world/:worldId',
    async (req: Request<{ worldId: string }>, res: Response) => {
      try {
        const characters = await dbService.getCharactersByWorldId(
          req.params.worldId
        )
        res.json(characters)
      } catch (error) {
        console.error('Error fetching characters:', error)
        res.status(500).json({ error: 'Failed to fetch characters' })
      }
    }
  )

  // GET /api/characters/:id - Get character by ID
  router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const character = await dbService.getCharacterById(req.params.id)
      if (!character) {
        return res.status(404).json({ error: 'Character not found' })
      }
      res.json(character)
    } catch (error) {
      console.error('Error fetching character:', error)
      res.status(500).json({ error: 'Failed to fetch character' })
    }
  })

  // POST /api/characters - Create new character
  router.post('/', async (req: Request, res: Response) => {
    try {
      const characterData: Omit<Character, 'id'> = req.body
      const character = await dbService.createCharacter(characterData)
      res.status(201).json(character)
    } catch (error) {
      console.error('Error creating character:', error)
      res.status(500).json({ error: 'Failed to create character' })
    }
  })

  // PUT /api/characters/:id - Update character
  router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const character = await dbService.updateCharacter(req.params.id, req.body)
      if (!character) {
        return res.status(404).json({ error: 'Character not found' })
      }
      res.json(character)
    } catch (error) {
      console.error('Error updating character:', error)
      res.status(500).json({ error: 'Failed to update character' })
    }
  })

  // DELETE /api/characters/:id - Delete character
  router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const deleted = await dbService.deleteCharacter(req.params.id)
      if (!deleted) {
        return res.status(404).json({ error: 'Character not found' })
      }
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting character:', error)
      res.status(500).json({ error: 'Failed to delete character' })
    }
  })

  return router
}
