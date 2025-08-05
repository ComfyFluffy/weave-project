import { Router, Request, Response } from 'express'
import { DatabaseService } from '../services/database.interface'
import { User } from '@weave/types'

export function createUserRoutes(dbService: DatabaseService) {
  const router = Router()

  // GET /api/users - Get all users
  router.get('/', async (req: Request, res: Response) => {
    try {
      const users = await dbService.getUsers()
      res.json(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      res.status(500).json({ error: 'Failed to fetch users' })
    }
  })

  // GET /api/users/:id - Get user by ID
  router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const user = await dbService.getUserById(req.params.id)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      console.error('Error fetching user:', error)
      res.status(500).json({ error: 'Failed to fetch user' })
    }
  })

  // POST /api/users - Create new user
  router.post('/', async (req: Request, res: Response) => {
    try {
      const userData: Omit<User, 'id'> = req.body
      const user = await dbService.createUser(userData)
      res.status(201).json(user)
    } catch (error) {
      console.error('Error creating user:', error)
      res.status(500).json({ error: 'Failed to create user' })
    }
  })

  // PUT /api/users/:id - Update user
  router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const user = await dbService.updateUser(req.params.id, req.body)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      console.error('Error updating user:', error)
      res.status(500).json({ error: 'Failed to update user' })
    }
  })

  return router
}
