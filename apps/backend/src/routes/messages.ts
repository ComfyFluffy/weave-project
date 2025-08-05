import { Router, Request, Response } from 'express'
import { DatabaseService } from '../services/database.interface'
import { Message } from '@weave/types'

export function createMessageRoutes(dbService: DatabaseService) {
  const router = Router()

  // GET /api/messages/channel/:channelId - Get messages by channel ID
  router.get(
    '/channel/:channelId',
    async (req: Request<{ channelId: string }>, res: Response) => {
      try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50
        const messages = await dbService.getMessagesByChannelId(
          req.params.channelId,
          limit
        )
        res.json(messages)
      } catch (error) {
        console.error('Error fetching messages:', error)
        res.status(500).json({ error: 'Failed to fetch messages' })
      }
    }
  )

  // POST /api/messages - Create new message
  router.post('/', async (req: Request, res: Response) => {
    try {
      const messageData: Omit<Message, 'id'> = req.body
      const message = await dbService.createMessage(messageData)
      res.status(201).json(message)
    } catch (error) {
      console.error('Error creating message:', error)
      res.status(500).json({ error: 'Failed to create message' })
    }
  })

  // PUT /api/messages/:id - Update message
  router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const message = await dbService.updateMessage(req.params.id, req.body)
      if (!message) {
        return res.status(404).json({ error: 'Message not found' })
      }
      res.json(message)
    } catch (error) {
      console.error('Error updating message:', error)
      res.status(500).json({ error: 'Failed to update message' })
    }
  })

  // DELETE /api/messages/:id - Delete message
  router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const deleted = await dbService.deleteMessage(req.params.id)
      if (!deleted) {
        return res.status(404).json({ error: 'Message not found' })
      }
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting message:', error)
      res.status(500).json({ error: 'Failed to delete message' })
    }
  })

  return router
}
