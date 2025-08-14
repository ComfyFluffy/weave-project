import { DatabaseService } from '../services/database.interface'
import { authContract } from '@weave/types/apis'
import { initServer } from '@ts-rest/express'

export function createAuthRouter(dbService: DatabaseService) {
  const s = initServer()

  return s.router(authContract, {
    login: async ({ body }) => {
      const user = await dbService.getUserByEmail(body.email)
      if (!user) {
        return {
          status: 400,
          body: {
            message: `User not found`,
          },
        }
      }

      return {
        status: 200,
        body: {
          token: '',
        },
      }
    },
    register: async ({ body }) => {
      const user = {
        displayName: body.displayName,
        email: body.email,
        password: body.password,
      }

      try {
        await dbService.createUser(user)
      } catch (error) {
        console.error('Error creating user:', error)
        return {
          status: 400,
          body: {
            message: 'Error creating user',
          },
        }
      }
      return {
        status: 200,
        body: {
          token: '',
        },
      }
    },
  })
}
