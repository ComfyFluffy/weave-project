import { userContract } from '@weave/types/apis'
import { initServer } from '@ts-rest/express'
import { prisma } from '../services/database'
import { mapPublicUser } from '../utils/mapper'

export function createUserRouter() {
  const s = initServer()
  return s.router(userContract, {
    getCurrentUser: async ({ req }) => {
      const userId = req.auth!.userId
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return {
          status: 404,
          body: {
            message: 'User not found',
          },
        }
      }

      return {
        status: 200,
        body: {
          user: mapPublicUser(user),
        },
      }
    },
    getUserById: async ({ params }) => {
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
      })

      if (!user) {
        return {
          status: 404,
          body: {
            message: 'User not found',
          },
        }
      }

      return {
        status: 200,
        body: {
          user: mapPublicUser(user),
        },
      }
    },
    updateUser: async ({ req, body }) => {
      const userId = req.auth!.userId

      try {
        const user = await prisma.user.update({
          where: { id: userId },
          data: {
            ...(body.displayName && { displayName: body.displayName }),
            ...(body.avatar !== undefined && { avatar: body.avatar }),
          },
        })

        return {
          status: 200,
          body: {
            user: mapPublicUser(user),
          },
        }
      } catch (error) {
        console.error('Error updating user:', error)
        return {
          status: 400,
          body: {
            message: 'Error updating user',
          },
        }
      }
    },
  })
}
