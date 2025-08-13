import express from 'express'
import { DatabaseService } from '../services/database.interface'
import {
  authContract,
  UserLoginRequestSchema,
  UserRegistrationRequestSchema,
} from '@weave/types/apis'
import { createExpressEndpoints, initServer } from '@ts-rest/express'
import { MockDatabaseService } from '../services/database.memory'
import { uuid } from 'zod/v4'

export function createAuthRouter() {
  const dbService = new MockDatabaseService()
  const s = initServer()
  
  return s.router(authContract, {
    login: async ({ body }) => {
      const user = await dbService.getUserByEmail(body.email)
      if (!user) {
        return {
          status: 400,
          body: {
            message: `User not found`
          },
        }
      }

      return {
        status: 200,
        body: {},
      }
    },
    register: async ({ body }) => {
      const result = UserRegistrationRequestSchema.safeParse(body)
      if (!result.success) {
        return {
          status: 400,
          body: {},
        }
      }
      const user = {
        displayName: result.data.displayName,
        id: result.data.displayName
      }
      
      try {
        await dbService.createUser(user)
      } catch (error) {
        console.error('Error creating user:', error)
        return {
          status: 400,
          body: {},
        }
      }
      return {
        status: 200,
        body: user
      }
    },
  })
}
