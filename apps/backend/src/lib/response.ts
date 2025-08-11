import type { Request, Response, NextFunction } from 'express'
import superjson from 'superjson'

// Helper to send SuperJSON payloads consistently
export function sendJSON(res: Response, data: unknown, status = 200) {
  const payload = superjson.serialize(data)
  return res.status(status).json(payload)
}

export function superjsonMiddleware() {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.superjson = (data: unknown, status = 200) => sendJSON(res, data, status)
    next()
  }
}
