import { Router, Request, Response } from 'express'
import { DatabaseService } from '../services/database.interface'
import { User, UserLogin, UserRegistration } from '@weave/types'
import bcrypt from 'bcrypt'

export function createAuthRoutes(dbService: DatabaseService) {
  const router = Router()

  // POST /api/auth/register - Register a new user
  router.post('/register', async (req: Request<{}, {}, UserRegistration>, res: Response) => {
    try {
      const { username, email, password } = req.body

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' })
      }

      // Check if user already exists
      const existingUser = await dbService.getUserByEmail(email)
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' })
      }

      // Hash password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user
      const userData: Omit<User, 'id'> = {
        username,
        email,
        password: hashedPassword
      }

      const user = await dbService.createUser(userData)
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user
      res.status(201).json(userWithoutPassword)
    } catch (error) {
      console.error('Error registering user:', error)
      res.status(500).json({ error: 'Failed to register user' })
    }
  })

  // POST /api/auth/login - Login user
  router.post('/login', async (req: Request<{}, {}, UserLogin>, res: Response) => {
    try {
      const { email, password } = req.body

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      // Find user by email
      const user = await dbService.getUserByEmail(email)
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user
      res.json(userWithoutPassword)
    } catch (error) {
      console.error('Error logging in user:', error)
      res.status(500).json({ error: 'Failed to login user' })
    }
  })

  return router
}