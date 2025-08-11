// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Response } from 'express'

declare global {
  namespace Express {
    interface Response {
      superjson: (data: unknown, status?: number) => Response
    }
  }
}
