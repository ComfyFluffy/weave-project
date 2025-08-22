import { Socket } from 'socket.io'
import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../utils/jwt'
import { JwtPayload } from '@weave/types/apis'
import { prisma } from '../services/database'

export interface AuthenticatedSocket extends Socket {
  userId?: string
  user?: {
    id: string
    displayName: string
    avatar?: string
  }
}

export const socketAuthMiddleware = (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) => {
  void (async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const token: string =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.replace('Bearer ', '')

      if (!token) {
        return next(new Error('Authentication token missing'))
      }

      // Verify JWT token
      const decoded = verify(token, JWT_SECRET) as JwtPayload

      if (!decoded.userId) {
        return next(new Error('Invalid token payload'))
      }

      // Fetch user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          displayName: true,
          avatar: true,
        },
      })

      if (!user) {
        return next(new Error('User not found'))
      }

      // Attach user info to socket
      socket.userId = user.id
      socket.user = {
        id: user.id,
        displayName: user.displayName,
        avatar: user.avatar ?? undefined,
      }

      console.log(
        `Socket authenticated for user: ${user.displayName} (${user.id})`
      )
      next()
    } catch (error) {
      console.error('Socket authentication error:', error)
      next(new Error('Authentication failed'))
    }
  })()
}
