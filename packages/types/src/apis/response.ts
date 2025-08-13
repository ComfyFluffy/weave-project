import { z } from 'zod'

export const UnauthorizedResponseSchema = z.object({
  message: z.string().default('Unauthorized!').optional(),
})
export type UserUnauthorizedResponse = z.infer<
  typeof UnauthorizedResponseSchema
>

export const SuccessResponseSchema = z.object({
  message: z.string().default('Success!').optional(),
})
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>

export const ErrorResponseSchema = z.object({
  message: z.string().default('Error!').optional(),
})
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

export const UserLoginResponseSchema = z.object({
  token: z.string(),
})
export type UserLoginResponse = z.infer<typeof UserLoginResponseSchema>
