import { initContract } from '@ts-rest/core'
import z from 'zod'
import { ErrorResponseSchema } from '..'
const c = initContract()

export const AuthRegistrationRequestSchema = z.object({
  displayName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(1).max(100),
})
export type AuthRegistrationRequest = z.infer<
  typeof AuthRegistrationRequestSchema
>

export const AuthLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(100),
})
export type AuthLoginRequest = z.infer<typeof AuthLoginRequestSchema>

export const AuthLoginResponseSchema = z.object({
  token: z.string(),
})
export type AuthLoginResponse = z.infer<typeof AuthLoginResponseSchema>

export const authContract = c.router(
  {
    login: {
      method: 'POST',
      path: '/login',
      body: AuthLoginRequestSchema,
      responses: {
        200: AuthLoginResponseSchema,
        400: ErrorResponseSchema,
      },
    },
    register: {
      method: 'POST',
      path: '/register',
      body: AuthRegistrationRequestSchema,
      responses: {
        200: AuthLoginResponseSchema,
        400: ErrorResponseSchema,
      },
    },
  },
  {
    pathPrefix: '/auth',
  }
)
