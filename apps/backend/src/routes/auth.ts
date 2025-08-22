import { authContract } from '@weave/types/apis'
import { initServer } from '@ts-rest/express'
import { generateToken } from '../utils/jwt'
import bcrypt from 'bcrypt'
import { prisma } from '../services/database'
const saltRound = 10

export function createAuthRouter() {
  const s = initServer()
  return s.router(authContract, {
    login: async ({ body }) => {
      const user = await prisma.user.findUnique({
        where: { email: body.email },
      })
      if (!user) {
        return {
          status: 404,
          body: {
            message: `User not found`,
          },
        }
      }

      if (!(await bcrypt.compare(body.password, user.password))) {
        return {
          status: 400,
          body: {
            message: `Invalid credentials`,
          },
        }
      }
      console.log('Generating token...')
      const token = generateToken({ userId: user.id })

      return {
        status: 200,
        body: {
          token,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    },
    register: async ({ body }) => {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: body.email },
        })
        if (existingUser) {
          return {
            status: 400,
            body: {
              message: 'User already exists',
            },
          }
        }

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            displayName: body.displayName,
            email: body.email,
            password: await bcrypt.hash(body.password, saltRound),
            avatar: null,
          },
        })

        // Generate a token for the newly registered user
        const token = generateToken({ userId: newUser.id })

        return {
          status: 200,
          body: {
            token,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      } catch (error) {
        console.error('Error creating user:', error)
        return {
          status: 400,
          body: {
            message: 'Error creating user',
          },
        }
      }
    },
  })
}
