import { Router } from 'express'
import { DatabaseService } from '../services/database.interface'

export function createAuthRoutes(dbService: DatabaseService) {
  const router = Router()

  // POST /api/auth/register - Register a new user
  router.post('/register', async (req, res) => {
    throw new Error('This endpoint is not implemented yet')
  })

  // POST /api/auth/login - Login user
  router.post('/login', async (req, res) => {
    throw new Error('This endpoint is not implemented yet')
  })

  return router
}
