import { initContract } from '@ts-rest/core'
import z from 'zod'
import { commonResponses } from '../common'
const c = initContract()

export const AuthRegistrationRequestSchema = z.object({
  displayName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(20),
})
export type AuthRegistrationRequest = z.infer<
  typeof AuthRegistrationRequestSchema
>

export const AuthLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
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
      },
    },
    register: {
      method: 'POST',
      path: '/register',
      body: AuthRegistrationRequestSchema,
      responses: {
        200: AuthLoginResponseSchema,
      },
    },
  },
  {
    pathPrefix: '/auth',
    commonResponses,
  }
)
