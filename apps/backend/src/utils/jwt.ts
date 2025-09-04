import { JwtPayload } from '@weave/types/apis'
import { sign } from 'jsonwebtoken'

export const JWT_SECRET = process.env.JWT_SECRET || 'weave-default-secret-key'

export const generateToken = (payload: JwtPayload): string => {
  return sign(payload, JWT_SECRET, {
    expiresIn: '60d',
    algorithm: 'HS256',
  })
}
