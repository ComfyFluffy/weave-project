import { JwtPayload } from '@weave/types/apis'

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload
    }
  }
}
