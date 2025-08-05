import { Router, Request, Response } from 'express'
import { DatabaseService } from '../services/database.interface'

export function createItemRoutes(dbService: DatabaseService) {
  const router = Router()

  // GET /api/items/templates - Get all item templates
  router.get('/templates', async (req: Request, res: Response) => {
    try {
      const templates = await dbService.getItemTemplates()
      res.json(templates)
    } catch (error) {
      console.error('Error fetching item templates:', error)
      res.status(500).json({ error: 'Failed to fetch item templates' })
    }
  })

  // GET /api/items/templates/:name - Get item template by name
  router.get(
    '/templates/:name',
    async (req: Request<{ name: string }>, res: Response) => {
      try {
        const template = await dbService.getItemTemplateByName(req.params.name)
        if (!template) {
          return res.status(404).json({ error: 'Item template not found' })
        }
        res.json(template)
      } catch (error) {
        console.error('Error fetching item template:', error)
        res.status(500).json({ error: 'Failed to fetch item template' })
      }
    }
  )

  // POST /api/items/templates - Create new item template
  router.post('/templates', async (req: Request, res: Response) => {
    try {
      const template = await dbService.createItemTemplate(req.body)
      res.status(201).json(template)
    } catch (error) {
      console.error('Error creating item template:', error)
      res.status(500).json({ error: 'Failed to create item template' })
    }
  })

  return router
}
