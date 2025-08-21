import { expressjwt as jwt } from 'express-jwt'
import { Request, Response, NextFunction } from 'express'
import { JWT_SECRET } from '../utils/jwt'

// Create JWT middleware using express-jwt
export const createJwtMiddleware = () => {
  const jwtMiddleware = jwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
  })

  return (req: Request, res: Response, next: NextFunction) => {
    void jwtMiddleware(req, res, (err) => {
      if (err) {
        return res.status(401).json({ message: 'Authentication Error' })
      }

      next()
    })
  }
}
