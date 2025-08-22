import { initContract } from '@ts-rest/core'
import z from 'zod'
import { PublicUserSchema } from '../..'
import { commonResponses } from '../common'
const c = initContract()

export const UserResponseSchema = z.object({
  user: PublicUserSchema,
})
export type UserResponse = z.infer<typeof UserResponseSchema>

export const userContract = c.router(
  {
    getCurrentUser: {
      method: 'GET',
      path: '/me',
      responses: {
        200: UserResponseSchema,
      },
    },
    getUserById: {
      method: 'GET',
      path: '/:userId',
      responses: {
        200: UserResponseSchema,
      },
    },
  },
  {
    pathPrefix: '/users',
    commonResponses,
  }
)
