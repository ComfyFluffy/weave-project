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
  })
}
